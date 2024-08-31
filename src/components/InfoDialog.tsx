'use client';

import Lottie from 'lottie-react';
import animationData from '@/assets/lotties/info.json';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil, Save, Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/hooks/useStore';
import { InfoData } from '@/types';

export type InfoDialogProps = {
  title?: string;
  description?: string;
  day: string;
  onUpdate?: () => void;
};

const DEFAULT_TITLE = 'Title';
const DEFAULT_DESCRIPTION = 'Description';

export function InfoDialog(props: InfoDialogProps) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(props.title || DEFAULT_TITLE);
  const [description, setDescription] = useState(
    props.description || DEFAULT_DESCRIPTION,
  );
  const setInfoInDay = useStore((state) => state.setInfoInDay);

  const hasChanges =
    (title !== props.title || description !== props.description) &&
    (title !== DEFAULT_TITLE || description !== DEFAULT_DESCRIPTION);
  const isDefault =
    title === DEFAULT_TITLE && description === DEFAULT_DESCRIPTION;

  function handleEdit() {
    setEditMode(true);
  }

  function handleSave() {
    const info: InfoData = { title, description };
    setInfoInDay(info, props.day);
    setEditMode(false);
    props.onUpdate?.();
  }

  function handleOpenChange() {
    if (editMode) {
      setTitle(props.title || DEFAULT_TITLE);
      setDescription(props.description || DEFAULT_DESCRIPTION);
    }
    if (!isDefault) {
      setTimeout(() => setEditMode(false), 100);
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isDefault ? (
          <Button onClick={() => setEditMode(true)} variant="ghost">
            <Ellipsis className="h-8 w-8" />
          </Button>
        ) : (
          <Button variant="ghost">
            <Lottie className="h-9 w-9" animationData={animationData} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[80%]">
        {editMode ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-left">edit information</DialogTitle>
              <DialogDescription className="text-left">
                Update the title and description for today.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              className={hasChanges ? 'border-destructive' : ''}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <Textarea
              className={`min-h-[120px] ${hasChanges && 'border-destructive'}`}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
            <div className="flex items-center gap-3">
              <Button onClick={handleSave} variant="outline" size="icon">
                <Save className="h-4 w-4" />
              </Button>
              {hasChanges && (
                <span className="text-xs font-light text-destructive">
                  changes detected
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <Button onClick={handleEdit} variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
