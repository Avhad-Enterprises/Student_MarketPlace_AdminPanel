/**
 * DATE INPUT COMPONENT - SHOWCASE & DOCUMENTATION
 * 
 * This file demonstrates all variants, states, and usage examples
 * of the DateInput component system.
 */

import React, { useState } from 'react';
import {
  DateInput,
  FormDateInput,
  CompactDateInput,
  LargeDateInput,
  ResponsiveDateInput,
  DateRangeInput,
  validateNotFuture,
  validateNotPast,
  validateMinAge,
  getTodayDateString,
  getDateOffset,
  formatDateForDisplay,
} from './date-input';
import { Info, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

// ============================================
// SHOWCASE CONTAINER
// ============================================

const ShowcaseSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="mb-12">
    <div className="mb-4">
      <h2 className="text-xl font-bold text-[#0e042f] mb-1">{title}</h2>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

const ExampleCard: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
    {children}
  </div>
);

// ============================================
// MAIN SHOWCASE COMPONENT
// ============================================

export const DateInputShowcase: React.FC = () => {
  // State for interactive examples
  const [basicDate, setBasicDate] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterDate, setFilterDate] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#0e042f] mb-2">
            Native Date Input Component
          </h1>
          <p className="text-gray-600 text-lg">
            A comprehensive date input system using native browser pickers with consistent styling
          </p>
        </div>

        {/* Documentation Panel */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-12 border border-purple-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0e042f] mb-2">Usage Guidelines</h3>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">✅ When to Use</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Date of birth input</li>
                    <li>• Appointment scheduling</li>
                    <li>• Date range filters</li>
                    <li>• Event date selection</li>
                    <li>• Deadline input</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">⚠️ Limitations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Native picker UI varies by browser</li>
                    <li>• Limited styling of picker popup</li>
                    <li>• Different mobile implementations</li>
                    <li>• Time zone considerations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">🌐 Browser Differences</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Chrome: Modern calendar picker</li>
                    <li>• Safari: Scroll wheels (iOS)</li>
                    <li>• Firefox: Calendar dropdown</li>
                    <li>• Edge: Windows date picker</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">📱 Mobile Behavior</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• iOS: Native wheel picker</li>
                    <li>• Android: Material date picker</li>
                    <li>• Larger tap targets (52px)</li>
                    <li>• Bottom sheet on mobile</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Examples */}
        <ShowcaseSection
          title="1. Basic Variants"
          description="Different size and style variants for various use cases"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExampleCard title="Small Size" description="For compact UIs and filters">
              <DateInput
                label="Filter Date"
                size="sm"
                value={filterDate}
                onValueChange={setFilterDate}
              />
            </ExampleCard>

            <ExampleCard title="Medium Size (Default)" description="Standard form input">
              <FormDateInput
                label="Select Date"
                value={basicDate}
                onValueChange={setBasicDate}
              />
            </ExampleCard>

            <ExampleCard title="Large Size" description="For emphasis">
              <LargeDateInput
                label="Important Date"
                value={appointmentDate}
                onValueChange={setAppointmentDate}
              />
            </ExampleCard>
          </div>
        </ShowcaseSection>

        {/* States */}
        <ShowcaseSection
          title="2. Component States"
          description="All possible states of the date input"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <ExampleCard title="Default State" description="Empty input, ready for interaction">
              <DateInput label="Select Date" placeholder="dd-mm-yyyy" />
            </ExampleCard>

            <ExampleCard title="Filled State" description="Input with a selected date">
              <DateInput label="Selected Date" value="2024-03-15" readOnly />
            </ExampleCard>

            <ExampleCard title="With Helper Text" description="Additional guidance for users">
              <DateInput
                label="Appointment Date"
                helperText="Select your preferred appointment date"
              />
            </ExampleCard>

            <ExampleCard title="Required Field" description="Shows asterisk indicator">
              <DateInput label="Date of Birth" required />
            </ExampleCard>

            <ExampleCard title="Error State" description="Validation error displayed">
              <DateInput
                label="Invalid Date"
                value="2030-01-01"
                error="Date cannot be in the future"
              />
            </ExampleCard>

            <ExampleCard title="Disabled State" description="Non-interactive, read-only">
              <DateInput
                label="Disabled Date"
                value="2024-01-15"
                disabled
              />
            </ExampleCard>
          </div>
        </ShowcaseSection>

        {/* With and Without Icons */}
        <ShowcaseSection
          title="3. Icon Options"
          description="Toggle calendar icon visibility"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <ExampleCard title="With Calendar Icon" description="Default, icon on the right">
              <DateInput
                label="Date with Icon"
                showIcon={true}
              />
            </ExampleCard>

            <ExampleCard title="Without Icon" description="Minimal, no icon">
              <DateInput
                label="Date without Icon"
                showIcon={false}
              />
            </ExampleCard>
          </div>
        </ShowcaseSection>

        {/* Validation Examples */}
        <ShowcaseSection
          title="4. Validation & Constraints"
          description="Date inputs with built-in validation"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <ExampleCard
              title="Disable Future Dates"
              description="Only past and present dates allowed"
            >
              <DateInput
                label="Date of Birth"
                value={birthDate}
                onValueChange={setBirthDate}
                disableFuture
                helperText="Cannot select future dates"
              />
            </ExampleCard>

            <ExampleCard
              title="Disable Past Dates"
              description="Only future and present dates allowed"
            >
              <DateInput
                label="Appointment Date"
                disablePast
                helperText="Cannot select past dates"
              />
            </ExampleCard>

            <ExampleCard
              title="Custom Validation"
              description="Minimum age requirement (18+)"
            >
              <DateInput
                label="Adult Date of Birth"
                validate={validateMinAge(18)}
                helperText="Must be at least 18 years old"
              />
            </ExampleCard>

            <ExampleCard
              title="Date Range Constraint"
              description="Limited to specific date range"
            >
              <DateInput
                label="Select Month (Jan 2024)"
                min="2024-01-01"
                max="2024-01-31"
                helperText="Only January 2024 dates allowed"
              />
            </ExampleCard>
          </div>
        </ShowcaseSection>

        {/* Date Range */}
        <ShowcaseSection
          title="5. Date Range Input"
          description="Start and end date selection with validation"
        >
          <ExampleCard
            title="Date Range Picker"
            description="Select a date range with automatic validation"
          >
            <DateRangeInput
              startLabel="Start Date"
              endLabel="End Date"
              startValue={startDate}
              endValue={endDate}
              onStartChange={setStartDate}
              onEndChange={setEndDate}
              helperText="End date must be after start date"
            />

            {startDate && endDate && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Selected Range:</strong> {formatDateForDisplay(startDate)} to {formatDateForDisplay(endDate)}
                </p>
              </div>
            )}
          </ExampleCard>

          <ExampleCard
            title="Stacked Date Range"
            description="Vertical layout for mobile"
          >
            <DateRangeInput
              startLabel="From"
              endLabel="To"
              inline={false}
              size="sm"
            />
          </ExampleCard>
        </ShowcaseSection>

        {/* Responsive */}
        <ShowcaseSection
          title="6. Responsive Behavior"
          description="Adapts to different screen sizes"
        >
          <ExampleCard
            title="Responsive Date Input"
            description="Auto-adjusts height based on screen size"
          >
            <ResponsiveDateInput
              label="Responsive Date"
              helperText="Resize window to see height adjust"
            />
          </ExampleCard>
        </ShowcaseSection>

        {/* Real-World Examples */}
        <ShowcaseSection
          title="7. Real-World Usage Examples"
          description="How the component looks in actual forms and interfaces"
        >
          {/* Student Form Example */}
          <ExampleCard
            title="Student Registration Form"
            description="Complete form with multiple date inputs"
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full h-12 px-3.5 rounded-[10px] border border-gray-300 text-sm font-medium text-[#0f172b] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                  />
                </div>
                <DateInput
                  label="Date of Birth"
                  required
                  disableFuture
                  helperText="Must be at least 18 years old"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full h-12 px-3.5 rounded-[10px] border border-gray-300 text-sm font-medium text-[#0f172b] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                  />
                </div>
                <DateInput
                  label="Course Start Date"
                  disablePast
                  helperText="Expected course start date"
                />
              </div>
            </div>
          </ExampleCard>

          {/* Application Form Example */}
          <ExampleCard
            title="Visa Application Form"
            description="Application with date constraints"
          >
            <div className="space-y-4">
              <DateInput
                label="Passport Issue Date"
                required
                disableFuture
              />
              <DateInput
                label="Passport Expiry Date"
                required
                disablePast
                helperText="Must be valid for at least 6 months"
              />
              <DateInput
                label="Intended Travel Date"
                required
                disablePast
              />
            </div>
          </ExampleCard>

          {/* Filters Panel Example */}
          <ExampleCard
            title="Data Filters Panel"
            description="Compact date filters for data tables"
          >
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Filter Options</h4>
              <DateRangeInput
                startLabel="From Date"
                endLabel="To Date"
                size="sm"
                helperText="Filter records by date range"
              />
              <button className="w-full h-10 bg-[#0e042f] text-white rounded-lg text-sm font-semibold hover:bg-[#1a0c4a] transition-colors">
                Apply Filters
              </button>
            </div>
          </ExampleCard>

          {/* Search Bar Example */}
          <ExampleCard
            title="Advanced Search"
            description="Date input in search interface"
          >
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search students..."
                className="flex-1 h-12 px-4 rounded-[10px] border border-gray-300 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
              />
              <CompactDateInput
                placeholder="Filter by date"
                className="w-48"
              />
              <button className="px-6 h-12 bg-[#0e042f] text-white rounded-[10px] font-semibold hover:bg-[#1a0c4a] transition-colors">
                Search
              </button>
            </div>
          </ExampleCard>
        </ShowcaseSection>

        {/* Do's and Don'ts */}
        <ShowcaseSection
          title="8. Best Practices"
          description="Guidelines for proper usage"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Do */}
            <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-green-900">✓ Do</h3>
              </div>
              <ul className="space-y-3 text-sm text-green-900">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Use clear, descriptive labels</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Provide helper text for complex requirements</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Set appropriate min/max constraints</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Show clear error messages</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Use required indicators when needed</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Test on multiple browsers and devices</span>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-green-200">
                <DateInput
                  label="Good Example"
                  required
                  helperText="Select your preferred appointment date"
                  disablePast
                />
              </div>
            </div>

            {/* Don't */}
            <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-900">✗ Don't</h3>
              </div>
              <ul className="space-y-3 text-sm text-red-900">
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Use vague labels like "Date" or "Select"</span>
                </li>
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Forget to validate date inputs</span>
                </li>
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Allow impossible date selections</span>
                </li>
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Hide validation errors</span>
                </li>
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Use for time-specific inputs (use time picker)</span>
                </li>
                <li className="flex gap-2">
                  <span>✗</span>
                  <span>Assume all browsers render the same</span>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-red-200">
                <DateInput
                  label="Date"
                // Bad: No helper text, no constraints, vague label
                />
              </div>
            </div>
          </div>
        </ShowcaseSection>

        {/* Accessibility */}
        <ShowcaseSection
          title="9. Accessibility Features"
          description="Built-in accessibility support"
        >
          <ExampleCard
            title="Accessibility Highlights"
            description="WCAG 2.1 compliant features"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Keyboard Navigation</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd> to focus input</li>
                  <li>• <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Space</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to open picker</li>
                  <li>• <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Arrow</kbd> keys to navigate dates</li>
                  <li>• <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> to close picker</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Screen Readers</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Proper ARIA labels</li>
                  <li>• Error announcements</li>
                  <li>• Required field indication</li>
                  <li>• Helper text association</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Visual</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• High contrast focus ring</li>
                  <li>• Color + icon for errors</li>
                  <li>• Minimum 44px tap targets</li>
                  <li>• Clear state indicators</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Touch Support</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Large touch targets (mobile)</li>
                  <li>• Native mobile pickers</li>
                  <li>• Responsive sizing</li>
                  <li>• Clear tap feedback</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Accessibility Testing Required
                  </p>
                  <p className="text-xs text-blue-700">
                    Always test with screen readers (NVDA, JAWS, VoiceOver) and keyboard-only navigation
                    to ensure full accessibility compliance.
                  </p>
                </div>
              </div>
            </div>
          </ExampleCard>
        </ShowcaseSection>

        {/* Component API */}
        <ShowcaseSection
          title="10. Component API Reference"
          description="All available props and options"
        >
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Prop</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Default</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">label</td>
                    <td className="px-4 py-3 text-gray-600">string</td>
                    <td className="px-4 py-3 text-gray-400">-</td>
                    <td className="px-4 py-3 text-gray-700">Label text above input</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">value</td>
                    <td className="px-4 py-3 text-gray-600">string</td>
                    <td className="px-4 py-3 text-gray-400">-</td>
                    <td className="px-4 py-3 text-gray-700">Selected date (YYYY-MM-DD)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">helperText</td>
                    <td className="px-4 py-3 text-gray-600">string</td>
                    <td className="px-4 py-3 text-gray-400">-</td>
                    <td className="px-4 py-3 text-gray-700">Helper text below input</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">error</td>
                    <td className="px-4 py-3 text-gray-600">string</td>
                    <td className="px-4 py-3 text-gray-400">-</td>
                    <td className="px-4 py-3 text-gray-700">Error message (overrides helper)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">required</td>
                    <td className="px-4 py-3 text-gray-600">boolean</td>
                    <td className="px-4 py-3 text-gray-400">false</td>
                    <td className="px-4 py-3 text-gray-700">Show required asterisk</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">size</td>
                    <td className="px-4 py-3 text-gray-600">'sm' | 'md' | 'lg'</td>
                    <td className="px-4 py-3 text-gray-400">'md'</td>
                    <td className="px-4 py-3 text-gray-700">Size variant</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">showIcon</td>
                    <td className="px-4 py-3 text-gray-600">boolean</td>
                    <td className="px-4 py-3 text-gray-400">true</td>
                    <td className="px-4 py-3 text-gray-700">Show calendar icon</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">disabled</td>
                    <td className="px-4 py-3 text-gray-600">boolean</td>
                    <td className="px-4 py-3 text-gray-400">false</td>
                    <td className="px-4 py-3 text-gray-700">Disable input</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">min</td>
                    <td className="px-4 py-3 text-gray-600">string</td>
                    <td className="px-4 py-3 text-gray-400">-</td>
                    <td className="px-4 py-3 text-gray-700">Minimum selectable date</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">max</td>
                    <td className="px-4 py-3 text-gray-600">string</td>
                    <td className="px-4 py-3 text-gray-400">-</td>
                    <td className="px-4 py-3 text-gray-700">Maximum selectable date</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">disableFuture</td>
                    <td className="px-4 py-3 text-gray-600">boolean</td>
                    <td className="px-4 py-3 text-gray-400">false</td>
                    <td className="px-4 py-3 text-gray-700">Disable future dates</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">disablePast</td>
                    <td className="px-4 py-3 text-gray-600">boolean</td>
                    <td className="px-4 py-3 text-gray-400">false</td>
                    <td className="px-4 py-3 text-gray-700">Disable past dates</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">validate</td>
                    <td className="px-4 py-3 text-gray-600">(value) =&gt; error</td>
                    <td className="px-4 py-3 text-gray-400">-</td>
                    <td className="px-4 py-3 text-gray-700">Custom validation function</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-purple-600">onValueChange</td>
                    <td className="px-4 py-3 text-gray-600">(value) =&gt; void</td>
                    <td className="px-4 py-3 text-gray-400">-</td>
                    <td className="px-4 py-3 text-gray-700">Callback on value change</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </div>
  );
};

export default DateInputShowcase;
