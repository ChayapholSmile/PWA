"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Gamepad2,
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  Music,
  ShoppingBag,
  Utensils,
  Car,
  Palette,
} from "lucide-react"

const categories = [
  { name: "เกม", icon: Gamepad2, slug: "games", color: "bg-red-500" },
  { name: "ธุรกิจ", icon: Briefcase, slug: "business", color: "bg-blue-500" },
  { name: "การศึกษา", icon: GraduationCap, slug: "education", color: "bg-green-500" },
  { name: "สุขภาพ", icon: Heart, slug: "health", color: "bg-pink-500" },
  { name: "ภาพถ่าย", icon: Camera, slug: "photography", color: "bg-purple-500" },
  { name: "เพลง", icon: Music, slug: "music", color: "bg-orange-500" },
  { name: "ช้อปปิ้ง", icon: ShoppingBag, slug: "shopping", color: "bg-yellow-500" },
  { name: "อาหาร", icon: Utensils, slug: "food", color: "bg-emerald-500" },
  { name: "การเดินทาง", icon: Car, slug: "travel", color: "bg-cyan-500" },
  { name: "ศิลปะ", icon: Palette, slug: "art", color: "bg-indigo-500" },
]

export function AppCategories() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">หมวดหมู่แอป</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.slug} href={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
