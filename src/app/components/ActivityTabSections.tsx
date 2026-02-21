import React from 'react';

const Placeholder = ({ name }: { name: string }) => (
    <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-500">
        <p className="font-bold text-lg mb-2">{name}</p>
        <p className="text-sm">This component is currently under development.</p>
    </div>
);

export const SessionHeatmapsSection = (props: any) => <Placeholder name="Session Heatmaps" />;
export const UserJourneySection = (props: any) => <Placeholder name="User Journey" />;
export const FunnelPerformanceSection = (props: any) => <Placeholder name="Funnel Performance" />;
export const ClickInteractionSection = (props: any) => <Placeholder name="Click Interaction" />;
export const BehavioralSegmentationSection = (props: any) => <Placeholder name="Behavioral Segmentation" />;
export const IntentSignalsSection = (props: any) => <Placeholder name="Intent Signals" />;
export const BehavioralFrictionSection = (props: any) => <Placeholder name="Behavioral Friction" />;
