"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link as LinkIcon, 
  Image as ImageIcon, List, ListOrdered, Quote, Heading1, Heading2, Heading3, 
  Undo, Redo, AlignLeft, AlignCenter, AlignRight, Trash2, Type, Palette,
  Table as TableIcon, Plus, Minus, Columns, Rows, Grid3X3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { generateSlug } from "@/lib/utils"

interface BlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string | null
  bannerImage: string | null
  author: string
  authorImage: string | null
  authorBio: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
  publishedAt: Date | null
  categories: string[]
  tags: string[]
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string[]
  canonicalUrl: string | null
  ogImage: string | null
  ogDescription: string | null
}

interface BlogEditorProps {
  blogPost: BlogPost
  setBlogPost: (blogPost: BlogPost) => void
  onTitleChange?: (title: string) => void
}

export function BlogEditor({ blogPost, setBlogPost, onTitleChange }: BlogEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 dark:border-gray-600 my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-2 font-semibold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 px-4 py-2',
        },
      }),
    ],
    content: blogPost.content || '<p>Start writing your blog post...</p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setBlogPost({
        ...blogPost,
        content: html
      })
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none text-gray-900 dark:text-white min-h-[400px] p-6 editor-content',
      },
    },
  })

  const handleFeaturedImageChange = (url: string | null) => {
    setBlogPost({
      ...blogPost,
      featuredImage: url
    })
  }

  const handleContentImageUpload = async (url: string | null) => {
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
      setShowImageDialog(false)
    }
  }

  const addImage = useCallback(() => {
    setShowImageDialog(true)
  }, [])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run()
  }, [editor])

  // Table functions
  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  const addColumnBefore = useCallback(() => {
    editor?.chain().focus().addColumnBefore().run()
  }, [editor])

  const addColumnAfter = useCallback(() => {
    editor?.chain().focus().addColumnAfter().run()
  }, [editor])

  const deleteColumn = useCallback(() => {
    editor?.chain().focus().deleteColumn().run()
  }, [editor])

  const addRowBefore = useCallback(() => {
    editor?.chain().focus().addRowBefore().run()
  }, [editor])

  const addRowAfter = useCallback(() => {
    editor?.chain().focus().addRowAfter().run()
  }, [editor])

  const deleteRow = useCallback(() => {
    editor?.chain().focus().deleteRow().run()
  }, [editor])

  const deleteTable = useCallback(() => {
    editor?.chain().focus().deleteTable().run()
  }, [editor])

  const toggleHeaderRow = useCallback(() => {
    editor?.chain().focus().toggleHeaderRow().run()
  }, [editor])

  if (!editor) {
    return <div>Loading editor...</div>
  }

  const toolbarButtons = [
    {
      icon: Bold,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold')
    },
    {
      icon: Italic,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic')
    },
    {
      icon: UnderlineIcon,
      title: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline')
    },
    {
      icon: Strikethrough,
      title: 'Strikethrough',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike')
    },
    {
      icon: Code,
      title: 'Inline Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code')
    },
    {
      icon: Heading1,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 })
    },
    {
      icon: Heading2,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 })
    },
    {
      icon: Heading3,
      title: 'Heading 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 })
    },
    {
      icon: List,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList')
    },
    {
      icon: ListOrdered,
      title: 'Numbered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList')
    },
    {
      icon: Quote,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote')
    },
    {
      icon: AlignLeft,
      title: 'Align Left',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' })
    },
    {
      icon: AlignCenter,
      title: 'Align Center',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' })
    },
    {
      icon: AlignRight,
      title: 'Align Right',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' })
    }
  ]

  const getWordCount = () => {
    const text = editor.getText()
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  const getCharCount = () => {
    return editor.getText().length
  }

  const getReadTime = () => {
    const wordCount = getWordCount()
    return Math.max(1, Math.ceil(wordCount / 225))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={blogPost.title}
              onChange={(e) => {
                const newTitle = e.target.value
                setBlogPost({ 
                  ...blogPost, 
                  title: newTitle,
                  slug: newTitle ? generateSlug(newTitle) : ''
                })
                onTitleChange?.(newTitle)
              }}
              placeholder="Enter blog post title..."
              className="w-full p-3 text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={blogPost.slug}
              onChange={(e) => setBlogPost({ ...blogPost, slug: e.target.value })}
              placeholder="post-url-slug"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Excerpt *
            </label>
            <textarea
              value={blogPost.excerpt}
              onChange={(e) => setBlogPost({ ...blogPost, excerpt: e.target.value })}
              placeholder="Brief description of the blog post..."
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Banner Image
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Primary image for blog header and cards (falls back to featured image if not set)
            </p>
            <ImageUpload
              value={blogPost.bannerImage}
              onChange={(url) => setBlogPost({ ...blogPost, bannerImage: url })}
              variant="featured"
              showMetadata={true}
              placeholder="Upload banner image for your blog post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Secondary image for content and social media sharing
            </p>
            <ImageUpload
              value={blogPost.featuredImage}
              onChange={handleFeaturedImageChange}
              variant="featured"
              showMetadata={true}
              placeholder="Upload featured image for your blog post"
            />
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-wrap items-center gap-1">
            {/* Undo/Redo */}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              title="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              title="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

            {/* Format Buttons */}
            {toolbarButtons.map((button, index) => {
              const Icon = button.icon
              return (
                <Button
                  key={index}
                  size="sm"
                  variant={button.isActive ? "default" : "ghost"}
                  className="h-8 w-8 p-0"
                  title={button.title}
                  onClick={button.action}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              )
            })}

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

            {/* Special Actions */}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3"
              onClick={setLink}
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Link
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3"
              onClick={addImage}
              title="Add Image"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3"
              onClick={addCodeBlock}
              title="Code Block"
            >
              <Type className="w-4 h-4 mr-2" />
              Code
            </Button>

            {/* Color Picker */}
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-3"
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Text Color"
              >
                <Palette className="w-4 h-4 mr-2" />
                Color
              </Button>
              
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="grid grid-cols-6 gap-2 mb-2">
                    {[
                      '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6',
                      '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6',
                      '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#6366F1', '#A855F7'
                    ].map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          editor.chain().focus().setColor(color).run()
                          setShowColorPicker(false)
                        }}
                      />
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run()
                      setShowColorPicker(false)
                    }}
                  >
                    Reset Color
                  </Button>
                </div>
              )}
            </div>

            {/* Table Actions */}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3"
              onClick={insertTable}
              title="Insert Table"
            >
              <TableIcon className="w-4 h-4 mr-2" />
              Table
            </Button>

            {editor.isActive('table') && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={addColumnBefore}
                  title="Add Column Before"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={addColumnAfter}
                  title="Add Column After"
                >
                  <Columns className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={deleteColumn}
                  title="Delete Column"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={addRowBefore}
                  title="Add Row Before"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={addRowAfter}
                  title="Add Row After"
                >
                  <Rows className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={deleteRow}
                  title="Delete Row"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={toggleHeaderRow}
                  title="Toggle Header Row"
                  disabled={!editor.can().toggleHeaderRow()}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={deleteTable}
                  title="Delete Table"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          </div>
        </div>

        {/* Editor */}
        <div className="min-h-[400px]">
          <style jsx global>{`
            .editor-content table {
              border-collapse: collapse;
              margin: 24px 0;
              overflow: hidden;
              table-layout: fixed;
              width: 100%;
            }
            
            .editor-content table td,
            .editor-content table th {
              border: 2px solid #e5e7eb;
              box-sizing: border-box;
              min-width: 120px;
              padding: 12px;
              position: relative;
              vertical-align: top;
            }
            
            .dark .editor-content table td,
            .dark .editor-content table th {
              border-color: #4b5563;
            }
            
            .editor-content table th {
              background-color: #f9fafb;
              font-weight: 600;
              text-align: left;
            }
            
            .dark .editor-content table th {
              background-color: #374151;
            }
            
            .editor-content table .selectedCell:after {
              background: rgba(59, 130, 246, 0.1);
              content: "";
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              pointer-events: none;
              position: absolute;
              z-index: 2;
            }
            
            .editor-content table .column-resize-handle {
              background-color: #3b82f6;
              bottom: -2px;
              position: absolute;
              right: -2px;
              top: 0;
              width: 4px;
              z-index: 20;
            }
            
            .editor-content table p {
              margin: 0;
            }
            
            .editor-content .tableWrapper {
              overflow-x: auto;
              margin: 1.5rem 0;
            }
            
            /* Improve blockquote styling */
            .editor-content blockquote {
              border-left: 4px solid #3b82f6;
              margin: 1.5rem 0;
              padding-left: 1rem;
              font-style: italic;
              color: #6b7280;
            }
            
            .dark .editor-content blockquote {
              color: #9ca3af;
            }
            
            /* Code block styling */
            .editor-content pre {
              background: #f8fafc;
              border-radius: 0.5rem;
              color: #1e293b;
              font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
              margin: 1.5rem 0;
              padding: 1rem;
              overflow-x: auto;
            }
            
            .dark .editor-content pre {
              background: #1e293b;
              color: #e2e8f0;
            }
            
            /* Inline code styling */
            .editor-content code {
              background: #f1f5f9;
              border-radius: 0.25rem;
              color: #be185d;
              font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
              font-size: 0.875em;
              padding: 0.125rem 0.25rem;
            }
            
            .dark .editor-content code {
              background: #334155;
              color: #f472b6;
            }
          `}</style>
          <EditorContent 
            editor={editor} 
            className="prose-editor dark:prose-invert"
          />
        </div>
      </div>

      {/* Image Upload Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Image to Content
            </h3>
            <ImageUpload
              value={null}
              onChange={handleContentImageUpload}
              variant="content"
              showMetadata={true}
              placeholder="Upload image for your content"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowImageDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Content Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>Words: {getWordCount()}</span>
            <span>Characters: {getCharCount()}</span>
            <span>Read time: ~{getReadTime()} min</span>
          </div>
          <div className="text-xs">
            Professional rich text editor with enhanced image handling
          </div>
        </div>
      </div>

      {/* Editor Features */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
          ✨ Professional Editor Features
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-green-600 dark:text-green-300 mb-4">
          <div>• Bold, Italic, Underline</div>
          <div>• Headings & Lists</div>
          <div>• Links & Images</div>
          <div>• Text Colors</div>
          <div>• Code Blocks</div>
          <div>• Text Alignment</div>
          <div>• Undo/Redo</div>
          <div>• Image Compression</div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-3">
          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            📷 Enhanced Image Handling
          </h5>
          <div className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
            <div>• <strong>Drag & Drop:</strong> Simply drag images into upload areas</div>
            <div>• <strong>Auto Compression:</strong> Images are automatically optimized</div>
            <div>• <strong>Validation:</strong> File type and size validation</div>
            <div>• <strong>Progress Feedback:</strong> Visual upload progress indicators</div>
            <div>• <strong>Metadata Display:</strong> View image dimensions and file info</div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mt-3">
          <h5 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
            🚀 Multi-Tab Code Blocks
          </h5>
          <p className="text-xs text-purple-600 dark:text-purple-300 mb-2">
            Create professional multi-tab code blocks by using this format in code blocks:
          </p>
          <div className="bg-white dark:bg-gray-800 rounded border p-2 font-mono text-xs">
            <div className="text-gray-600 dark:text-gray-400">
              tabs:example-project<br/>
              Tab 1: Component.tsx<br/>
              ```tsx<br/>
              export function MyComponent() {`{`}<br/>
              &nbsp;&nbsp;return &lt;div&gt;Hello World&lt;/div&gt;<br/>
              {`}`}<br/>
              ```<br/>
              Tab 2: styles.css<br/>
              ```css<br/>
              .my-component {`{`}<br/>
              &nbsp;&nbsp;color: blue;<br/>
              {`}`}<br/>
              ```
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 