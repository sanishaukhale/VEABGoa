
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Users, Edit3, Trash2 } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { TeamMember } from '@/types';
import TeamMemberForm from '@/components/admin/team/TeamMemberForm';
import type { TeamMemberFormValues } from '@/lib/schemas/teamMemberSchema';
import { saveTeamMember, deleteTeamMember } from './actions';

export default function ManageTeamPage() {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);


  const fetchTeamMembers = useCallback(async () => {
    setIsLoading(true);
    if (!firestore) {
      toast({ title: "Error", description: "Firestore not available.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    try {
      const membersCollectionRef = collection(firestore, 'teamMembers');
      const q = query(membersCollectionRef, orderBy('displayOrder', 'asc'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      const members = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as TeamMember));
      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({ title: "Error", description: "Could not fetch team members.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleAddMember = () => {
    setEditingMember(null);
    setShowFormModal(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (data: TeamMemberFormValues) => {
    setIsSubmitting(true);
    const result = await saveTeamMember(data, editingMember?.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      setShowFormModal(false);
      setEditingMember(null);
      fetchTeamMembers(); // Refresh list
    } else {
      toast({ title: "Error", description: result.error || "Failed to save team member.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };
  
  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    setIsSubmitting(true);
    const result = await deleteTeamMember(memberToDelete.id);
     if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchTeamMembers(); // Refresh list
    } else {
      toast({ title: "Error", description: result.error || "Failed to delete team member.", variant: "destructive" });
    }
    setMemberToDelete(null); // Close dialog by clearing the state
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center mb-1">
              <Users size={28} className="text-primary mr-3" />
              <CardTitle className="text-3xl text-primary">Manage Team Members</CardTitle>
            </div>
            <CardDescription>Add, edit, or remove team members.</CardDescription>
          </div>
          <Button onClick={handleAddMember} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle size={18} className="mr-2" /> Add New Member
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : teamMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No team members found. Add one to get started!</p>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="flex items-center justify-between p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-semibold text-lg text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.displayOrder !== null && member.displayOrder !== undefined && (
                        <p className="text-xs text-accent mt-1">Display Order: {member.displayOrder}</p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditMember(member)} aria-label={`Edit ${member.name}`}>
                      <Edit3 size={16} className="mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setMemberToDelete(member)} aria-label={`Delete ${member.name}`}>
                        <Trash2 size={16} className="mr-1" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showFormModal} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowFormModal(false);
            setEditingMember(null); // Reset editing state when dialog closes
          } else {
            setShowFormModal(true);
          }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </DialogTitle>
            <DialogDescription>
              {editingMember ? "Update the details for this team member." : "Fill in the details for the new team member."}
            </DialogDescription>
          </DialogHeader>
          <TeamMemberForm
            member={editingMember}
            onSubmitAction={handleFormSubmit}
            onFormClose={() => {
                setShowFormModal(false);
                setEditingMember(null);
            }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {memberToDelete && (
        <AlertDialog open={!!memberToDelete} onOpenChange={(isOpen) => !isOpen && setMemberToDelete(null) }>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete {memberToDelete?.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the team member
                    from the database.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setMemberToDelete(null)} disabled={isSubmitting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Delete
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
