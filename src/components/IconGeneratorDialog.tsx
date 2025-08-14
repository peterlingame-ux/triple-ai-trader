import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconGenerator } from './IconGenerator';
import { Wand2 } from 'lucide-react';

export const IconGeneratorDialog: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate 3D Icons
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-blue-950">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            3D Cryptocurrency Icon Generator
          </DialogTitle>
        </DialogHeader>
        <IconGenerator 
          onIconGenerated={(symbol, url) => {
            console.log(`Generated icon for ${symbol}: ${url}`);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};