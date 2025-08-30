import { AppForm } from "@/components/developer/app-form"

export default function NewAppPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">เพิ่มแอปใหม่</h1>
        <p className="text-muted-foreground">สร้างแอปพลิเคชันใหม่และส่งเพื่อขออนุมัติ</p>
      </div>

      <AppForm mode="create" />
    </div>
  )
}
