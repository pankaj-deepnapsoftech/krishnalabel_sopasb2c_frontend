import { useState } from "react"
import {
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react"

// Sample data (same as before)
const tabsData = [
  {
    id: "Products",
    label: "Products",
  },
  {
    id: "Stores",
    label: "Stores",
  },
  {
    id: "Buyers",
    label: "Buyers",
  },
  {
    id: "Suppliers",
    label: "Suppliers",
  },
  {
    id: "BOMs",
    label: "BOMs",
  },
  {
    id: "Inventory",
    label: "Inventory",
  },
]

export function ProductTabs() {
  return (
    <Tabs variant="enclosed" isFitted colorScheme="teal">
      <TabList mb={4}> 
        {tabsData.map((tab) => (
          <Tab key={tab.id}>{tab.label}</Tab>
        ))}
      </TabList>
    </Tabs>
  )
}
