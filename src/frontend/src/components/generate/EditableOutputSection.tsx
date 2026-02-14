import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '../../utils/clipboard';

interface EditableOutputSectionProps {
  title: string;
  content: string;
  onContentChange: (content: string) => void;
}

export default function EditableOutputSection({
  title,
  content,
  onContentChange,
}: EditableOutputSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    onContentChange(editedContent);
    setIsEditing(false);
    toast.success('Changes saved');
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      toast.success('Copied to clipboard');
    } else {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <Button size="sm" onClick={handleSave}>
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={handleEdit}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={12}
            className="font-mono text-sm"
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>
        )}
      </CardContent>
    </Card>
  );
}
