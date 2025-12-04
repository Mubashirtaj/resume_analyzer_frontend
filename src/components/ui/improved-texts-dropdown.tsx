'use client'

import { useState } from 'react'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'

interface ImprovedTextsDropdownProps {
  improvedTexts: string[]
}

export function ImprovedTextsDropdown({ improvedTexts }: ImprovedTextsDropdownProps) {
  const [openDropdown, setOpenDropdown] = useState(false)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={() => setOpenDropdown(!openDropdown)}>
        {openDropdown ? <ChevronDown className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        <span>My CV Summaries</span>
      </SidebarMenuButton>

      {openDropdown && (
        <SidebarMenuSub>
          {improvedTexts.length > 0 ? (
            improvedTexts.map((text, idx) => (
              <SidebarMenuSubItem key={idx}>
                <SidebarMenuSubButton asChild>
                  <a href="#">{text}</a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))
          ) : (
            <SidebarMenuSubItem>
              <div className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400 italic">
                No summary available
              </div>
            </SidebarMenuSubItem>
          )}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}
