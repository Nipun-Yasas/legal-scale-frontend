"use client";

import React, { useState } from "react";
import {
  Globe,
  Mail,
  Lock,
  Bell,
  Database,
  Save,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Reusable field components ── */
const Field = ({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8 py-4 border-b border-borderPrimary last:border-0">
    <div className="sm:w-56 shrink-0">
      <p className="text-sm font-medium text-textPrimary">{label}</p>
      {description && (
        <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const TextInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-background border border-borderPrimary rounded-xl px-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
      checked ? "bg-blue-500" : "bg-borderPrimary"
    )}
  >
    <span
      className={cn(
        "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
        checked ? "translate-x-6" : "translate-x-1"
      )}
    />
  </button>
);

const SelectInput = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-background border border-borderPrimary rounded-xl px-3 py-2 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

/* ── Section wrapper ── */
const Section = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl bg-backgroundSecondary border border-borderPrimary shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-borderPrimary bg-hoverPrimary">
      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">{icon}</div>
      <div>
        <h2 className="text-sm font-semibold text-textPrimary">{title}</h2>
        <p className="text-xs text-textSecondary">{description}</p>
      </div>
    </div>
    <div className="px-6">{children}</div>
  </div>
);

/* ── Main Page ── */
export default function SystemConfigPage() {
  const [saved, setSaved] = useState(false);

  // General
  const [siteName, setSiteName] = useState("LegalScale");
  const [siteUrl, setSiteUrl] = useState("https://legal.mobitel.lk");
  const [timezone, setTimezone] = useState("Asia/Colombo");
  const [language, setLanguage] = useState("en");

  // Email
  const [smtpHost, setSmtpHost] = useState("smtp.mobitel.lk");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("noreply@mobitel.lk");
  const [smtpPass, setSmtpPass] = useState("");

  // Security
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [passwordExpiry, setPasswordExpiry] = useState("90");

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [activityLog, setActivityLog] = useState(false);

  // Database
  const [backupEnabled, setBackupEnabled] = useState(true);
  const [backupFreq, setBackupFreq] = useState("daily");
  const [retentionDays, setRetentionDays] = useState("30");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">System Config</h1>
          <p className="text-sm text-textSecondary mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-green-500 font-medium animate-pulse">
              ✓ Saved successfully
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* General */}
      <Section
        icon={<Globe className="h-4 w-4" />}
        title="General"
        description="Basic system identification and localization"
      >
        <Field label="Site Name" description="Displayed in the browser tab and emails">
          <TextInput value={siteName} onChange={setSiteName} placeholder="LegalScale" />
        </Field>
        <Field label="Site URL" description="The public-facing URL of the application">
          <TextInput value={siteUrl} onChange={setSiteUrl} placeholder="https://..." />
        </Field>
        <Field label="Timezone">
          <SelectInput
            value={timezone}
            onChange={setTimezone}
            options={[
              { label: "Asia/Colombo (UTC+5:30)", value: "Asia/Colombo" },
              { label: "UTC", value: "UTC" },
              { label: "Asia/Kolkata (UTC+5:30)", value: "Asia/Kolkata" },
            ]}
          />
        </Field>
        <Field label="Language">
          <SelectInput
            value={language}
            onChange={setLanguage}
            options={[
              { label: "English", value: "en" },
              { label: "Sinhala", value: "si" },
              { label: "Tamil", value: "ta" },
            ]}
          />
        </Field>
      </Section>

      {/* Email */}
      <Section
        icon={<Mail className="h-4 w-4" />}
        title="Email / SMTP"
        description="Configure the outgoing email server"
      >
        <Field label="SMTP Host">
          <TextInput value={smtpHost} onChange={setSmtpHost} placeholder="smtp.example.com" />
        </Field>
        <Field label="SMTP Port">
          <TextInput value={smtpPort} onChange={setSmtpPort} placeholder="587" />
        </Field>
        <Field label="SMTP Username">
          <TextInput value={smtpUser} onChange={setSmtpUser} placeholder="noreply@example.com" />
        </Field>
        <Field label="SMTP Password">
          <TextInput
            value={smtpPass}
            onChange={setSmtpPass}
            type="password"
            placeholder="••••••••"
          />
        </Field>
      </Section>

      {/* Security */}
      <Section
        icon={<Lock className="h-4 w-4" />}
        title="Security"
        description="Authentication and session security settings"
      >
        <Field
          label="Two-Factor Authentication"
          description="Require MFA for all users"
        >
          <Toggle checked={mfaEnabled} onChange={setMfaEnabled} />
        </Field>
        <Field
          label="Session Timeout (minutes)"
          description="Auto-logout after inactivity"
        >
          <TextInput value={sessionTimeout} onChange={setSessionTimeout} placeholder="60" />
        </Field>
        <Field
          label="Max Login Attempts"
          description="Lock account after failed attempts"
        >
          <TextInput value={maxLoginAttempts} onChange={setMaxLoginAttempts} placeholder="5" />
        </Field>
        <Field
          label="Password Expiry (days)"
          description="Force password reset after N days"
        >
          <TextInput value={passwordExpiry} onChange={setPasswordExpiry} placeholder="90" />
        </Field>
      </Section>

      {/* Notifications */}
      <Section
        icon={<Bell className="h-4 w-4" />}
        title="Notifications"
        description="Control what notifications are sent system-wide"
      >
        <Field label="Email Notifications" description="Send notifications via email">
          <Toggle checked={emailNotif} onChange={setEmailNotif} />
        </Field>
        <Field label="System Alerts" description="Critical system alerts to admins">
          <Toggle checked={systemAlerts} onChange={setSystemAlerts} />
        </Field>
        <Field label="Activity Logs" description="Log and notify on user activity">
          <Toggle checked={activityLog} onChange={setActivityLog} />
        </Field>
      </Section>

      {/* Database & Backup */}
      <Section
        icon={<Database className="h-4 w-4" />}
        title="Database & Backup"
        description="Automated database backup settings"
      >
        <Field label="Automatic Backups" description="Enable scheduled database backups">
          <Toggle checked={backupEnabled} onChange={setBackupEnabled} />
        </Field>
        <Field label="Backup Frequency">
          <SelectInput
            value={backupFreq}
            onChange={setBackupFreq}
            options={[
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
            ]}
          />
        </Field>
        <Field label="Retention Period (days)" description="How long to keep backup files">
          <TextInput value={retentionDays} onChange={setRetentionDays} placeholder="30" />
        </Field>
        <Field label="Manual Backup" description="Trigger an on-demand backup">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-borderPrimary text-sm text-textPrimary hover:bg-hoverPrimary transition-colors">
            <RefreshCw className="h-4 w-4" />
            Run Backup Now
          </button>
        </Field>
      </Section>
    </div>
  );
}
