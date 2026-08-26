import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReportDetail } from "@/features/moderation/report-detail";

describe("moderation detail", () => {
  it("keeps private evidence labeled and requires a reason", () => {
    render(<ReportDetail report={{ id:"R-1",category:"Privacy",subject:"Photo",priority:"urgent",status:"open",reporter:"@kai",age:"2m",evidence:"Private attachment" }} role="moderator" />);
    expect(screen.getByText("Private evidence")).toBeVisible();
    expect(screen.getByLabelText("Resolution reason")).toBeRequired();
  });
});
