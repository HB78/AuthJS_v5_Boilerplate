import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "./ui/badge";

const UserInfo = ({ user, label }) => {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>ID</p>
          <p className="text-xs max-w-[180px] truncate font-mono rounded-md bg-slate-100">
            {user?.id}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>Name</p>
          <p className="text-xs max-w-[180px] truncate font-mono rounded-md bg-slate-100">
            {user?.name}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>Email</p>
          <p className="text-xs max-w-[180px] truncate font-mono rounded-md bg-slate-100">
            {user?.email}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>Role</p>
          <p className="text-xs max-w-[180px] truncate font-mono rounded-md bg-slate-100">
            {user?.role}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>Two factor authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
