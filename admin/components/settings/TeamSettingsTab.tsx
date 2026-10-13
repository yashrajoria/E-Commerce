import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Trash2 } from "lucide-react";
import type { StoreMembership } from "@ecommerce/shared";

export interface TeamSettingsTabProps {
  activeStoreName?: string;
  members: StoreMembership[];
  inviteEmail: string;
  setInviteEmail: (v: string) => void;
  inviteRole: string;
  setInviteRole: (v: string) => void;
  inviting: boolean;
  onInviteMember: (e: React.FormEvent) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
}

export const TeamSettingsTab: React.FC<TeamSettingsTabProps> = ({
  activeStoreName,
  members,
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  inviting,
  onInviteMember,
  onRemoveMember,
}) => {
  return (
    <>
      <Card className="glass-effect border-white/[0.06]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-purple-400" /> Invite Staff Member
          </CardTitle>
          <CardDescription>
            Grant team members access to manage catalog, orders, and promotions for {activeStoreName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onInviteMember} className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="teammate@company.com"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              className="h-10 text-xs bg-white/[0.04] border-white/[0.08] rounded-xl flex-1"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-foreground focus:ring-1 focus:ring-ring sm:w-36"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="viewer">Viewer</option>
            </select>
            <Button
              type="submit"
              disabled={inviting || !inviteEmail.trim()}
              className="gradient-purple text-white gap-2 text-xs h-10 px-5 rounded-xl shrink-0"
            >
              <UserPlus size={14} />
              {inviting ? "Inviting..." : "Send Invite"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-effect border-white/[0.06]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" /> Active Members ({members.length})
          </CardTitle>
          <CardDescription>Team members with authorized roles in this store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No additional staff members yet.</p>
          ) : (
            members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {(m.user?.name || m.user?.email || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {m.user?.name || m.user?.email || "Team Member"}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {m.user?.email || m.user_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="capitalize text-[10px] border-primary/30 text-primary"
                  >
                    {m.role}
                  </Badge>
                  {m.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveMember(m.user_id)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 size={13} />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
};

