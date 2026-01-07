import { useState, useEffect } from 'react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export type Note = {
  id: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
}

type NotesSectionProps = {
  communicationId: string
  notes?: Note[]
  onAddNote?: (content: string) => void
  onDeleteNote?: (noteId: string) => void
  onUpdateNote?: (noteId: string, content: string) => void
  initialIsAdding?: boolean
  onAddingStateChange?: (isAdding: boolean) => void
}

export function NotesSection({
  communicationId,
  notes = [],
  onAddNote,
  onDeleteNote,
  onUpdateNote,
  initialIsAdding = false,
  onAddingStateChange,
}: NotesSectionProps) {
  const [isAdding, setIsAdding] = useState(initialIsAdding)
  const [newNote, setNewNote] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  // Sync with external state
  useEffect(() => {
    if (initialIsAdding !== isAdding) {
      setIsAdding(initialIsAdding)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIsAdding])

  const handleSetIsAdding = (value: boolean) => {
    setIsAdding(value)
    if (onAddingStateChange) {
      onAddingStateChange(value)
    }
  }

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote.trim())
      setNewNote('')
      handleSetIsAdding(false)
    }
  }

  const handleStartEdit = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const handleSaveEdit = (noteId: string) => {
    if (editContent.trim() && onUpdateNote) {
      onUpdateNote(noteId, editContent.trim())
      setEditingId(null)
      setEditContent('')
    }
  }

  const handleDelete = (noteId: string) => {
    if (onDeleteNote) {
      onDeleteNote(noteId)
    }
  }

  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold'>Notes</h3>
        {!isAdding && (
          <Button
            size='sm'
            variant='outline'
            onClick={() => handleSetIsAdding(true)}
            className='gap-2'
          >
            <Plus className='h-4 w-4' />
            Add Note
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <div className='space-y-3 p-5 border rounded-lg bg-muted/50'>
          <Textarea
            placeholder='Add a note for team context or history...'
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className='resize-none text-base'
          />
          <div className='flex items-center gap-2 justify-end'>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => {
                handleSetIsAdding(false)
                setNewNote('')
              }}
            >
              Cancel
            </Button>
            <Button size='sm' onClick={handleAddNote} disabled={!newNote.trim()}>
              Save Note
            </Button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 && !isAdding ? (
        <div className='text-center py-12 text-base text-muted-foreground'>
          <p>No notes yet. Add a note to share context with your team.</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {notes.map((note) => (
            <div
              key={note.id}
              className='p-5 border rounded-lg bg-background space-y-3 shadow-sm'
            >
              {editingId === note.id ? (
                <div className='space-y-2'>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className='resize-none text-base'
                  />
                  <div className='flex items-center gap-2 justify-end'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => {
                        setEditingId(null)
                        setEditContent('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size='sm'
                      onClick={() => handleSaveEdit(note.id)}
                      disabled={!editContent.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
              <>
                <div className='flex items-start justify-between gap-3'>
                  <p className='text-base leading-relaxed flex-1 text-foreground'>{note.content}</p>
                  <div className='flex items-center gap-1 shrink-0'>
                    {onUpdateNote && (
                      <button
                        onClick={() => handleStartEdit(note)}
                        className='p-2 hover:bg-muted rounded transition-colors'
                        title='Edit note'
                      >
                        <Edit2 className='h-4 w-4 text-muted-foreground' />
                      </button>
                    )}
                    {onDeleteNote && (
                      <button
                        onClick={() => handleDelete(note.id)}
                        className='p-2 hover:bg-muted rounded transition-colors'
                        title='Delete note'
                      >
                        <Trash2 className='h-4 w-4 text-muted-foreground' />
                      </button>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground font-medium'>
                  <span>{note.author}</span>
                  <span>•</span>
                  <span>{format(note.createdAt, 'MMM dd, yyyy HH:mm')}</span>
                  {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                    <>
                      <span>•</span>
                      <span>Edited {format(note.updatedAt, 'MMM dd, yyyy')}</span>
                    </>
                  )}
                </div>
              </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

