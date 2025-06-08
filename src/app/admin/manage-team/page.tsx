
"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Users, Edit3, Trash2, ImageOff } from 'lucide-react';
import { firestore, storage } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL, type StorageError } from 'firebase/storage';
import type { TeamMember } from '@/types';
import TeamMemberForm from '@/components/admin/team/TeamMemberForm';
import type { TeamMemberFormValues } from '@/lib/schemas/teamMemberSchema';
import { saveTeamMember, deleteTeamMember } from './actions';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function ManageTeamPage() {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [resolvedListImageUrls, setResolvedListImageUrls] = useState<Record<string, string>>({});
  const [isLoadingImages, setIsLoadingImages] = useState(true);


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

  useEffect(() => {
    if (teamMembers.length === 0 && !isLoading) {
        setIsLoadingImages(false);
        setResolvedListImageUrls({});
        return;
    }
    if (teamMembers.length === 0) return;

    const fetchImageUrls = async () => {
        setIsLoadingImages(true);
        const urls: Record<string, string> = {};
        for (const member of teamMembers) {
            if (member.imageUrl && !member.imageUrl.startsWith('https://') && !member.imageUrl.startsWith('http://') && !member.imageUrl.startsWith('/')) {
                if (storage) {
                    try {
                        const imageSPath = member.imageUrl;
                        const sRef = storageRef(storage, imageSPath);
                        const downloadUrl = await getDownloadURL(sRef);
                        urls[member.id] = downloadUrl;
                    } catch (error) {
                        const firebaseError = error as StorageError;
                        console.error(`Failed to get download URL for ${member.name} (${member.imageUrl}):`, firebaseError.code, firebaseError.message);
                        urls[member.id] = 'error'; // Special marker for error
                    }
                } else {
                    console.warn("Firebase Storage not available for member:", member.name);
                    urls[member.id] = 'error';
                }
            } else if (member.imageUrl) { // Already a full URL or local placeholder path
                urls[member.id] = member.imageUrl.startsWith('/') ? `${basePath}${member.imageUrl}` : member.imageUrl;
            } else { // No image URL provided
                urls[member.id] = 'placeholder'; // Special marker for placeholder
            }
        }
        setResolvedListImageUrls(urls);
        setIsLoadingImages(false);
    };

    fetchImageUrls();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamMembers, isLoading]);


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
      fetchTeamMembers(); // Refresh list to get new data and trigger image fetching
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
    setMemberToDelete(null); 
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-grow">
            <div className="flex items-center mb-1">
              <Users size={32} className="text-primary mr-3 hidden sm:block" />
              <CardTitle className="text-2xl sm:text-3xl text-primary">Manage Team Members</CardTitle>
            </div>
            <CardDescription>Add, edit, or remove team members from the public website.</CardDescription>
          </div>
          <Button onClick={handleAddMember} className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0">
            <PlusCircle size={18} className="mr-2" /> Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No team members found. Add one to get started!</p>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 flex-grow">
                    {isLoadingImages && !resolvedListImageUrls[member.id] ? (
                       <Skeleton className="w-16 h-16 rounded-md" />
                    ) : resolvedListImageUrls[member.id] && resolvedListImageUrls[member.id] !== 'error' && resolvedListImageUrls[member.id] !== 'placeholder' ? (
                      <Image
                        src={resolvedListImageUrls[member.id] as string}
                        alt={`Image of ${member.name}`}
                        width={64}
                        height={64}
                        className="rounded-md object-cover w-16 h-16 border"
                        unoptimized={resolvedListImageUrls[member.id]?.includes('placehold.co')}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center border" title="Image not available">
                        <ImageOff size={32} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <p className="font-semibold text-lg text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      {member.displayOrder !== null && member.displayOrder !== undefined && (
                          <p className="text-xs text-accent mt-1">Order: {member.displayOrder}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-x-2 flex-shrink-0 self-end sm:self-center">
                    <Button variant="outline" size="sm" onClick={() => handleEditMember(member)} aria-label={`Edit ${member.name}`}>
                      <Edit3 size={16} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setMemberToDelete(member)} aria-label={`Delete ${member.name}`}>
                        <Trash2 size={16} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Delete</span>
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
            setEditingMember(null); 
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
                    from the database and may affect the public "About Us" page.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setMemberToDelete(null)} disabled={isSubmitting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                    Delete Member
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

    