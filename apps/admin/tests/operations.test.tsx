import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StaffManager } from "@/features/staff/staff-manager";
import { EntitlementView } from "@/features/subscriptions/entitlement-view";

describe("sensitive operations boundaries", () => {
  it("hides staff role mutation from content admins", () => {
    render(<StaffManager role="content_admin" staff={[]} />);
    expect(screen.queryByRole("button", { name: /change role/i })).not.toBeInTheDocument();
  });

  it("never exposes a refund action in entitlement support", () => {
    render(<EntitlementView entitlements={[{id:"e1",title:"@kai · Plus",detail:"Stripe",status:"Active",meta:"Renews Sep 17"}]} />);
    expect(screen.queryByRole("button", { name: /refund/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resync/i })).toBeVisible();
  });
});
