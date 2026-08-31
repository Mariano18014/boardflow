import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatarUpload } from "@/components/modules/users/ProfileAvatarUpload";
import { ProfileNameForm } from "@/components/modules/users/ProfileNameForm";
import { useMyProfile } from "@/components/modules/users/use-my-profile";

export default function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile();

  return (
    <AppShell title="Mi perfil">
      <div className="p-7 max-w-md flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Mi perfil</CardTitle>
            <CardDescription>Personalizá tu nombre y tu avatar.</CardDescription>
          </CardHeader>
          {isLoading && (
            <CardContent>
              <p className="text-sm text-muted-foreground">Cargando perfil...</p>
            </CardContent>
          )}
          {profile && (
            <CardContent className="flex flex-col gap-6">
              <ProfileAvatarUpload fullName={profile.fullName} currentAvatarUrl={profile.avatarUrl} />
              <ProfileNameForm currentFullName={profile.fullName} />
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </CardContent>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
