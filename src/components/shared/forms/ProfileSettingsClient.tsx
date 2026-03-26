"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { updateProfile } from "@/app/actions/user";

export function ProfileSettingsClient({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const name = session?.user?.name || initialName;
  const email = session?.user?.email || initialEmail;

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const currentPassword = formData.get("currentPassword") as string;

    if (newPassword && !currentPassword) {
      setError("Current password is required to set a new password.");
      return;
    }

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        setError(result.error);
      } else {
        toast.success("Profile updated successfully");
        await update({ name: formData.get("name") }); // Update NextAuth session
        setIsEditing(false);
      }
    });
  }

  return (
    <div className="bg-cream border border-earth/10 p-8 md:p-12 space-y-12 shadow-sm min-h-[500px]">
      <div className="flex justify-between items-center border-b border-earth/20 pb-4">
        <h2 className="text-2xl font-serif text-earth uppercase tracking-widest">Profile Details</h2>
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="secondary" 
            className="text-earth border-earth/20 hover:bg-earth hover:text-cream transition-colors text-xs uppercase tracking-widest px-8"
          >
            Edit Details
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-clay/10 border border-clay/30 text-clay px-4 py-3 text-sm">
          {error}
        </div>
      )}
      
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-earth/50">Name</p>
              <p className="text-lg text-earth">{name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-earth/50">Email / Provider</p>
              <p className="text-lg text-earth">{email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-earth/50">Password</p>
              <p className="text-lg text-earth">********</p>
            </div>
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} className="space-y-8 max-w-xl">
          <div className="grid grid-cols-1 space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-widest text-earth font-semibold">Full Name</label>
               <Input name="name" defaultValue={name} required className="bg-sand border-earth/20" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-widest text-earth/50 font-semibold cursor-not-allowed">Email (Cannot be changed)</label>
               <Input name="email" defaultValue={email} disabled className="bg-sand/50 border-earth/10 text-earth/50" />
            </div>

            <div className="pt-6 border-t border-earth/10 space-y-6">
              <h3 className="text-lg font-serif text-earth">Change Password</h3>
              <p className="text-xs text-earth/60 mb-2">Leave blank if you don't wish to change your password.</p>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest text-earth font-semibold">Current Password</label>
                 <Input type="password" name="currentPassword" placeholder="Required to change password" className="bg-sand border-earth/20" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest text-earth font-semibold">New Password</label>
                 <Input type="password" name="newPassword" placeholder="Enter new password" className="bg-sand border-earth/20" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-earth/10">
             <Button 
               type="button" 
               variant="secondary" 
               onClick={() => setIsEditing(false)}
               disabled={isPending}
               className="border-earth/20 text-earth hover:bg-ash hover:text-earth uppercase tracking-widest text-xs"
             >
               Cancel
             </Button>
             <Button 
               type="submit" 
               disabled={isPending}
               className="bg-earth text-cream hover:bg-earth/90 uppercase tracking-widest text-xs"
             >
               {isPending ? "Saving..." : "Save Changes"}
             </Button>
          </div>
        </form>
      )}
    </div>
  );
}
