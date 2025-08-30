import { ChangelogForm } from "@/components/changelog/changelog-form"

export default function NewChangelogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">เพิ่ม Changelog ใหม่</h1>
        <p className="text-muted-foreground">สร้างประวัติการอัปเดตสำหรับแอปของคุณ</p>
      </div>

      <ChangelogForm mode="create" />
    </div>
  )
}
