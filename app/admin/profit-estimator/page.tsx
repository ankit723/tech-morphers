"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function ProfitEstimator() {

    //user inputs
    const [totalAdSpent, setTotalAdSpent] = useState(12000);
    const [averageCpc, setAverageCpc] = useState(80);
    const [averageRevenuePerLead, setAverageRevenuePerLead] = useState(20000);
    
    const [estimatorViewToFormFillRate, setEstimatorViewToFormFillRate] = useState(40);
    const [formFillToValidRate, setFormFillToValidRate] = useState(60);
    const [validToInterestedRate, setValidToInterestedRate] = useState(70);
    const [interestedToValidLeadRate, setInterestedToValidLeadRate] = useState(60);
    const [validLeadToConversionRate, setValidLeadToConversionRate] = useState(50);

    //calculated values
    const [totalEstimatorViews, setTotalEstimatorViews] = useState(0);
    const [totalEstimatorFormFills, setTotalEstimatorFormFills] = useState(0);
    const [totalValidEstimatorFormFills, setTotalValidEstimatorFormFills] = useState(0);
    const [totalInterestedLeads, setTotalInterestedLeads] = useState(0);
    const [totalValidLeads, setTotalValidLeads] = useState(0);
    const [totalConversions, setTotalConversions] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);


    useEffect(() => {
        const views = totalAdSpent && averageCpc ? Math.round(totalAdSpent / averageCpc) : 0;
        const fills = Math.round(views * (estimatorViewToFormFillRate / 100));
        const validFills = Math.round(fills * (formFillToValidRate / 100));
        const interested = Math.round(validFills * (validToInterestedRate / 100));
        const validLeads = Math.round(interested * (interestedToValidLeadRate / 100));
        const conversions = Math.round(validLeads * (validLeadToConversionRate / 100));
        const profit = conversions * averageRevenuePerLead - totalAdSpent;
      
        setTotalEstimatorViews(views);
        setTotalEstimatorFormFills(fills);
        setTotalValidEstimatorFormFills(validFills);
        setTotalInterestedLeads(interested);
        setTotalValidLeads(validLeads);
        setTotalConversions(conversions);
        setTotalProfit(profit);
      }, [
        totalAdSpent,
        averageCpc,
        estimatorViewToFormFillRate,
        formFillToValidRate,
        validToInterestedRate,
        interestedToValidLeadRate,
        validLeadToConversionRate,
        averageRevenuePerLead
    ]);
      
      

    return (
        <div>
            <h1 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 text-transparent bg-clip-text">Profit Estimator</h1>
            <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="totalAdSpent">Total Ad Spent</Label>
                    <Input type="number" id="totalAdSpent" value={totalAdSpent} onChange={(e) => setTotalAdSpent(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="averageCpc">Average CPC</Label>
                    <Input type="number" id="averageCpc" value={averageCpc} onChange={(e) => setAverageCpc(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="averageConversionRate">Estimator View To Form Fill Rate</Label> 
                    <Input type="number" id="averageConversionRate" value={estimatorViewToFormFillRate} onChange={(e) => setEstimatorViewToFormFillRate(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="averageConversionRate">Form Fill To Valid Rate</Label> 
                    <Input type="number" id="averageConversionRate" value={formFillToValidRate} onChange={(e) => setFormFillToValidRate(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="averageConversionRate">Valid To Interested Rate</Label> 
                    <Input type="number" id="averageConversionRate" value={validToInterestedRate} onChange={(e) => setValidToInterestedRate(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="averageConversionRate">Interested To Valid Lead Rate</Label> 
                    <Input type="number" id="averageConversionRate" value={interestedToValidLeadRate} onChange={(e) => setInterestedToValidLeadRate(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="averageConversionRate">Valid Lead To Conversion Rate</Label> 
                    <Input type="number" id="averageConversionRate" value={validLeadToConversionRate} onChange={(e) => setValidLeadToConversionRate(Number(e.target.value))} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="averageRevenuePerLead">Average Revenue Per Lead</Label>
                    <Input type="number" id="averageRevenuePerLead" value={averageRevenuePerLead} onChange={(e) => setAverageRevenuePerLead(Number(e.target.value))} />
                </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 mt-10 text-center bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 text-transparent bg-clip-text">Forcasted Profit</h1>
            <div className="flex flex-col gap-2 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gradient-to-r from-blue-600 via-violet-600 to-pink-600">
                <Table>
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead className="w-[100px]">Funnel Stage</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold">Estimator Views</TableCell>
                            <TableCell>{totalEstimatorViews?.toFixed(0)}</TableCell>
                            <TableCell>Number of Peoples who visited the estimator page</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Form Fills ({estimatorViewToFormFillRate}%)</TableCell>
                            <TableCell>{totalEstimatorFormFills?.toFixed(0)}</TableCell>
                            <TableCell>Number of people who actually filled the estimator form</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Valid Fills ({formFillToValidRate}%)</TableCell>
                            <TableCell>{totalValidEstimatorFormFills?.toFixed(0)}</TableCell>
                            <TableCell>Number of people who actually filled the estimator form with correct data </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Interested Leads ({validToInterestedRate}%)</TableCell>
                            <TableCell>{totalInterestedLeads?.toFixed(0)}</TableCell>
                            <TableCell>Nuber of people with whom we actually had conversation</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Qualified Leads ({interestedToValidLeadRate}%)</TableCell>
                            <TableCell>{totalValidLeads?.toFixed(0)}</TableCell>
                            <TableCell>Number of people who were on the same page as we were after conversation</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Total Conversions ({validLeadToConversionRate}%)</TableCell>
                            <TableCell>{totalConversions?.toFixed(0)}</TableCell>
                            <TableCell>Number people who actually depositted the advance payment</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold">Total Profit</TableCell>
                            <TableCell>₹{totalProfit?.toFixed(0)}</TableCell>
                            <TableCell>Total Money in the account after deducting the add spend</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}