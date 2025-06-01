"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  ChevronDown,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Switch } from "@/components/ui/switch";
import { ExchangeIcon } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";

// Sidebar navigation items
const navigationItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    active: false,
  },
  {
    icon: ExchangeIcon,
    label: "Exchange Leadboard",
    active: true,
  },
  {
    icon: Settings,
    label: "Setting",
    active: false,
  },
];

// Tab items for the main content
const tabItems = [
  { label: "Rate Setting", active: true },
  { label: "Update History", active: false },
];

export default function DashboardPage() {
  const [isVisibleForUser, setIsVisibleForUser] = useState(true);
  const [activeTab, setActiveTab] = useState("Rate Setting");

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <motion.aside
        className="w-80 bg-white flex flex-col"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="p-6">
          <Link href="/">
            <Image
              src="/svg/logo-exchange-black.svg"
              alt="ExchanGo 24"
              width={180}
              height={36}
              className="h-9 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    item.active
                      ? "bg-[#F1F1F1] text-[var(--color-greeny)]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <Typography
                    variant="span"
                    fontFamily="dm"
                    className="font-medium"
                  >
                    {item.label}
                  </Typography>
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          className="bg-white px-8 py-6"
          initial={{ y: -70 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-end gap-6 py-0.5">
            <div className="flex items-center gap-4">
              {/* Visibility Toggle */}
              <div className="flex items-center gap-3">
                <Switch
                  checked={isVisibleForUser}
                  onCheckedChange={setIsVisibleForUser}
                />
                <div className="flex items-center gap-2">
                  {isVisibleForUser ? (
                    <Eye className="h-4 w-4 text-[var(--color-greeny)]" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  <Typography
                    variant="span"
                    fontFamily="dm"
                    className="text-sm font-medium text-gray-700"
                  >
                    Visible for user
                  </Typography>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center flex-col gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Typography
                    variant="span"
                    fontFamily="dm"
                    className="text-white font-medium text-xs"
                  >
                    A
                  </Typography>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <Typography
                      variant="span"
                      fontFamily="dm"
                      className="font-medium text-gray-900"
                    >
                      Welcome, Atlas Exchange
                    </Typography>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500">
                    <Typography variant="span" fontFamily="dm">
                      Admin office
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-dm mb-2">
                Exchange Leadboard
              </h2>

              <Typography variant="p" fontFamily="dm" className="text-gray-600">
                Manage exchange rates with precision. Update rates in real-time
                to ensure transparency and competitiveness in the market.
              </Typography>
            </div>

            {/* Last Update Info */}
            <div className="mb-6">
              <Typography
                variant="p"
                fontFamily="dm"
                className="text-sm text-gray-600"
              >
                <span className="font-medium">Last Update :</span> April 30,
                2024 - 09:45
              </Typography>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {tabItems.map((tab) => (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(tab.label)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        tab.label === activeTab
                          ? "border-[var(--color-greeny)] text-[var(--color-greeny)]"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Typography variant="span" fontFamily="dm">
                        {tab.label}
                      </Typography>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Empty State */}
            <AnimatePresence mode="wait">
              {activeTab === "Rate Setting" && (
                <motion.div
                  key="rate-setting"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  {/* Empty State Illustration */}
                  <div className="mb-4">
                    <Image
                      src="/svg/empty-dashboard.svg"
                      alt="Empty State"
                      width={200}
                      height={200}
                    />
                  </div>

                  {/* Empty State Content */}
                  <div className="text-center max-w-md">
                    <Typography
                      variant="h3"
                      fontFamily="dm"
                      className="text-xl font-semibold text-gray-900 mb-3"
                    >
                      You haven't set any exchange rates yet.
                    </Typography>
                    <Typography
                      variant="p"
                      fontFamily="dm"
                      className="text-gray-600 text-sm mb-8"
                    >
                      Please create a list of the currencies you offer so your
                      customers can see accurate pricing
                    </Typography>

                    {/* Add Currency Button */}
                    <Button variant="gradient" size="lg" className="px-8 py-3">
                      <Plus className="h-4 w-4 mr-2" />
                      <Typography
                        variant="span"
                        fontFamily="dm"
                        className="font-medium"
                      >
                        Add new Currency
                      </Typography>
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeTab === "Update History" && (
                <motion.div
                  key="update-history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <Typography
                    variant="h3"
                    fontFamily="dm"
                    className="text-xl font-semibold text-gray-900 mb-3"
                  >
                    Update History
                  </Typography>
                  <Typography
                    variant="p"
                    fontFamily="dm"
                    className="text-gray-600"
                  >
                    No update history available yet.
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
