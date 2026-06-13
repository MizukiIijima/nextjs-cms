import { getProfile } from "@/src/lib/profile";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="grow p-6">
      <div className="mt-6 text-sm font-medium text-slate-500">
        ダッシュボード / プロフィール編集
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">プロフィール編集</h1>
        <p className="text-sm text-slate-500">
          記事下に表示するプロフィール情報を編集します。
        </p>
      </div>

      <ProfileForm
        profile={profile}
      />
    </div>

  );
}
