import type { CafeRecord, QuestRecord } from "@/lib/data/types";

export const completeCafe: CafeRecord = { id: "cafe-test", name: "Soft Hours Coffee", slug: "soft-hours-coffee", city: "Pasig", status: "draft", priceLevel: 2, spend: "₱120–₱350", vibes: ["Soft Hours"], approvedPhotoCount: 3, completeness: 100, description: "Sunlit corners, thoughtful drinks, and calm afternoons with reliable Wi-Fi.", address: "21 East Capitol Drive, Kapitolyo", hours: "8:00 AM–9:00 PM" };
export const incompleteCafe: CafeRecord = { ...completeCafe, id: "cafe-incomplete", description: "Too short", vibes: [], approvedPhotoCount: 0, hours: "Missing", completeness: 52 };

export const draftQuest: QuestRecord = { id: "quest-test", title: "Order For Each Other", status: "draft", difficulty: "medium", xp: 180, duration: 60, completions: 0, safetyMessage: "", objectives: ["Choose a drink for your partner"] };
