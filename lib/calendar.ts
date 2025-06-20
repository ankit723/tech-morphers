interface CalendarEvent {
  summary: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  attendeeEmail: string;
  attendeeName: string;
  organizerEmail?: string;
  organizerName?: string;
  meetingLink?: string;
}

export function generateGoogleMeetLink(): string {
  // Option 1: Use Jitsi Meet (Free, works with random room IDs)
  const randomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const roomId = `TechMorphers-${randomString(12)}`;
  
  // Use Jitsi Meet (free and reliable)
  return `https://meet.jit.si/${roomId}`;
  
  // TODO: For production, implement one of these options:
  // Option 2: Use Google Calendar API to create real Google Meet rooms
  // Option 3: Use Zoom API to create Zoom meetings
  // Option 4: Use Microsoft Teams API
  // Option 5: Use a fixed Google Meet room for all calls
}

export function generateCalendarInvite(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const now = new Date();
  const uid = `${now.getTime()}@techmorphers.com`;
  
  // Enhanced description for calendar with proper line breaks
  const calendarDescription = event.description
    .replace(/\n/g, '\\n')
    .replace(/━/g, '-'); // Replace unicode characters for better compatibility
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tech Morphers//Consultation Call//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${event.summary}`,
    `DESCRIPTION:${calendarDescription}`,
    event.location ? `LOCATION:${event.location}` : '',
    // Add Google Meet specific properties
    event.meetingLink ? `X-GOOGLE-CONFERENCE:${event.meetingLink}` : '',
    event.meetingLink ? `CONFERENCE:${event.meetingLink}` : '',
    `ATTENDEE;CN=${event.attendeeName};RSVP=TRUE;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT:mailto:${event.attendeeEmail}`,
    `ORGANIZER;CN=${event.organizerName || 'Tech Morphers Team'}:mailto:${event.organizerEmail || 'hello@techmorphers.com'}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'TRANSP:OPAQUE',
    'CLASS:PUBLIC',
    // Multiple alarms for better reminder coverage
    'BEGIN:VALARM',
    'TRIGGER:-PT1440M', // 24 hours before
    'DESCRIPTION:Tech Morphers call tomorrow',
    'ACTION:DISPLAY',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT60M', // 1 hour before
    'DESCRIPTION:Tech Morphers call in 1 hour',
    'ACTION:DISPLAY',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M', // 15 minutes before
    'DESCRIPTION:Tech Morphers call starting soon',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(line => line !== '').join('\r\n');

  return icsContent;
}

export function createScheduleCallEvent(
  name: string,
  email: string,
  scheduledDate: Date,
  scheduledTime: string,
  duration: number,
  projectBrief: string,
  meetingLink: string
): CalendarEvent {
  // Parse time and create start date
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const startDate = new Date(scheduledDate);
  startDate.setHours(hours, minutes, 0, 0);
  
  // Create end date
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + duration);

  const summary = `Tech Morphers Consultation Call - ${name}`;
  
  // Enhanced description with Video Call styling
  const description = `🚀 TECH MORPHERS CONSULTATION CALL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👋 Hi ${name}!

We're excited to discuss your project with you in this ${duration}-minute consultation session.

🎥 JOIN VIDEO CALL
${meetingLink}

📋 YOUR PROJECT BRIEF:
"${projectBrief}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 MEETING PREPARATION CHECKLIST:

✓ Test your camera and microphone beforehand
✓ Prepare any relevant documents or project materials  
✓ Have your questions and requirements ready
✓ Join the meeting 2-3 minutes early
✓ Ensure stable internet connection
✓ No app download required - join directly from browser

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 WHAT TO EXPECT:

• Project requirements discussion
• Technical recommendations
• Timeline and roadmap planning
• Q&A session
• Next steps planning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 NEED TO RESCHEDULE?
Contact us at least 24 hours in advance:
📧 hello@techmorphers.com
🌐 https://www.techmorphers.com

Looking forward to speaking with you!

Best regards,
Tech Morphers Team`;

  return {
    summary,
    description,
    startDate,
    endDate,
    location: `Video Call: ${meetingLink}`,
    attendeeEmail: email,
    attendeeName: name,
    organizerEmail: 'hello@techmorphers.com',
    organizerName: 'Tech Morphers Team',
    meetingLink
  };
}

export function generateCalendarAttachment(
  name: string,
  email: string,
  scheduledDate: Date,
  scheduledTime: string,
  duration: number,
  projectBrief: string,
  meetingLink: string
): { filename: string; content: Buffer } {
  const event = createScheduleCallEvent(
    name,
    email,
    scheduledDate,
    scheduledTime,
    duration,
    projectBrief,
    meetingLink
  );
  
  const icsContent = generateCalendarInvite(event);
  const filename = `consultation-call-${name.replace(/\s+/g, '-').toLowerCase()}.ics`;
  
  return {
    filename,
    content: Buffer.from(icsContent, 'utf8')
  };
} 