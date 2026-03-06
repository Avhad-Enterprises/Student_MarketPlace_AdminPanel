import React, { useState } from 'react';
import {
    X,
    Sparkles,
    CheckCircle,
    AlertCircle,
    ChevronDown,
    ChevronRight,
    FileText,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';

type ItemType = 'Reading' | 'Listening' | 'Writing' | 'Speaking' | 'Mock Test';

interface GenerateContentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    itemType: ItemType;
    currentData: {
        exam: string;
        difficulty: string;
        topic: string[];
    };
    onApply: (generatedContent: any) => void;
}

export const GenerateContentDrawer: React.FC<GenerateContentDrawerProps> = ({
    isOpen,
    onClose,
    itemType,
    currentData,
    onApply
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [previewExpanded, setPreviewExpanded] = useState({
        passage: true,
        questions: false,
        answers: false
    });

    // Form state
    const [formData, setFormData] = useState({
        language: 'English',
        tone: 'Formal',
        length: 'Medium',
        passageLength: '500',
        questionCount: '15',
        questionTypes: {
            mcq: true,
            trueFalse: true,
            matching: false,
            completion: false
        },
        includeExplanations: true,
        includeAnswerKey: true,
        accent: 'Neutral',
        taskType: 'Task 2',
        promptStyle: 'Academic',
        includeSampleAnswer: false,
        includeBandTips: true,
        speakingType: 'Part 1',
        promptCount: '5',
        includeFollowups: true,
        mockComposition: 'Topic-aligned',
        includeSections: {
            reading: true,
            listening: true,
            writing: true,
            speaking: true
        }
    });

    const [generatedContent, setGeneratedContent] = useState<any>(null);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleQuestionTypeToggle = (type: string) => {
        setFormData({
            ...formData,
            questionTypes: {
                ...formData.questionTypes,
                [type]: !formData.questionTypes[type as keyof typeof formData.questionTypes]
            }
        });
    };

    const handleSectionToggle = (section: string) => {
        setFormData({
            ...formData,
            includeSections: {
                ...formData.includeSections,
                [section]: !formData.includeSections[section as keyof typeof formData.includeSections]
            }
        });
    };

    const handleGenerate = () => {
        setIsGenerating(true);

        // Simulate AI generation
        setTimeout(() => {
            const mockContent = generateMockContent();
            setGeneratedContent(mockContent);
            setIsGenerating(false);
            setHasGenerated(true);
            toast.success('Content generated successfully');
        }, 2000);
    };

    const generateMockContent = () => {
        switch (itemType) {
            case 'Reading':
                return {
                    passage: `Climate change represents one of the most significant challenges facing humanity in the 21st century. The scientific consensus is clear: global temperatures are rising at an unprecedented rate, largely due to human activities such as fossil fuel combustion and deforestation. This warming trend has far-reaching consequences for ecosystems, weather patterns, and sea levels worldwide.\n\nThe effects of climate change are already visible across the globe. Polar ice caps are melting at alarming rates, contributing to rising sea levels that threaten coastal communities. Extreme weather events, including hurricanes, droughts, and heatwaves, have become more frequent and severe. These changes disrupt agricultural systems, endanger biodiversity, and pose significant risks to human health and economic stability.\n\nAddressing climate change requires coordinated global action. International agreements like the Paris Climate Accord represent important steps toward limiting temperature increases. However, individual nations must implement concrete policies to reduce greenhouse gas emissions, transition to renewable energy sources, and adapt to changing environmental conditions. The window for meaningful action is narrowing, making immediate and sustained efforts crucial for protecting our planet's future.`,
                    questions: [
                        {
                            id: 'q1',
                            type: 'MCQ',
                            questionText: 'According to the passage, what is the primary cause of rising global temperatures?',
                            options: [
                                'Natural weather cycles',
                                'Human activities such as fossil fuel use',
                                'Volcanic eruptions',
                                'Solar radiation changes'
                            ],
                            correctAnswer: 'Human activities such as fossil fuel use',
                            explanation: 'The passage explicitly states that global temperatures are rising largely due to human activities such as fossil fuel combustion and deforestation.'
                        },
                        {
                            id: 'q2',
                            type: 'True/False/NG',
                            questionText: 'The Paris Climate Accord has successfully stopped all climate change effects.',
                            correctAnswer: 'False',
                            explanation: 'The passage mentions the Paris Climate Accord as an important step but does not claim it has stopped climate change effects. It emphasizes that more action is needed.'
                        },
                        {
                            id: 'q3',
                            type: 'MCQ',
                            questionText: 'Which of the following is NOT mentioned as an effect of climate change?',
                            options: [
                                'Melting polar ice caps',
                                'Rising sea levels',
                                'Increased volcanic activity',
                                'More frequent extreme weather'
                            ],
                            correctAnswer: 'Increased volcanic activity',
                            explanation: 'The passage discusses melting ice caps, rising sea levels, and extreme weather events, but does not mention volcanic activity.'
                        }
                    ],
                    answerKey: {
                        q1: 'B',
                        q2: 'False',
                        q3: 'C'
                    }
                };

            case 'Listening':
                return {
                    transcript: `[Professor]: Good morning, everyone. Today we're going to discuss renewable energy sources and their role in combating climate change. Now, when we talk about renewable energy, what comes to mind?\n\n[Student 1]: Solar panels and wind turbines?\n\n[Professor]: Exactly! Those are two of the most common forms. Solar energy harnesses the power of the sun through photovoltaic cells, while wind energy uses turbines to convert wind motion into electricity. Both are becoming increasingly cost-effective and efficient.\n\n[Student 2]: But aren't they unreliable because they depend on weather conditions?\n\n[Professor]: That's a great question. While it&apos;s true that solar and wind power are intermittent sources, advances in battery storage technology are helping to address this challenge. We can now store excess energy produced during peak times and use it when production is lower.\n\n[Student 1]: What about other renewable sources?\n\n[Professor]: Well, we also have hydroelectric power, which uses flowing water to generate electricity. Then there's geothermal energy, which taps into heat from the Earth's core. And let's not forget biomass energy, which converts organic materials into fuel. Each has its own advantages and limitations depending on geographical location and infrastructure.`,
                    questions: [
                        {
                            id: 'q1',
                            type: 'MCQ',
                            questionText: 'What challenge of renewable energy does the professor address?',
                            options: [
                                'High installation costs',
                                'Weather dependency',
                                'Government regulations',
                                'Public acceptance'
                            ],
                            correctAnswer: 'Weather dependency',
                            explanation: 'Student 2 asks about reliability due to weather conditions, which the professor addresses by discussing battery storage technology.'
                        }
                    ]
                };

            case 'Writing':
                return {
                    prompt: `Some people believe that governments should invest more in public transportation systems, while others think that building more roads for private vehicles is more important.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.`,
                    sampleAnswer: formData.includeSampleAnswer ? `The debate over transportation infrastructure investment represents a crucial policy decision for modern governments. While some advocate for enhanced public transport systems, others prioritize expanding road networks for private vehicles. This essay will examine both perspectives before presenting my own viewpoint.\n\nProponents of public transportation investment argue that it offers numerous societal benefits. Firstly, comprehensive public transit systems reduce traffic congestion by encouraging citizens to leave their cars at home. Additionally, buses and trains produce fewer emissions per passenger compared to individual vehicles, contributing to environmental sustainability. Cities like Tokyo and Singapore demonstrate how efficient public transport can improve quality of life while reducing carbon footprints.\n\nConversely, supporters of road expansion contend that private vehicle infrastructure provides greater flexibility and convenience. They argue that personal cars allow people to travel on their own schedules without depending on fixed transit timetables. Furthermore, improved road networks can stimulate economic growth by facilitating the movement of goods and services, particularly in areas where public transport is impractical.\n\nIn my opinion, governments should prioritize public transportation investment, though not to the complete exclusion of road maintenance. The environmental and social benefits of efficient public transit outweigh the convenience of private vehicles, especially in urban areas where congestion and pollution are pressing concerns. However, a balanced approach that includes both public transport enhancement and strategic road improvements would best serve diverse community needs.\n\n(238 words)` : null,
                    bandTips: formData.includeBandTips ? [
                        'Address both views comprehensively before stating your opinion',
                        'Use clear topic sentences to organize each paragraph',
                        'Include specific examples to support your arguments',
                        'Maintain formal academic tone throughout',
                        'Ensure logical flow between paragraphs using linking words',
                        'Aim for 250-280 words for optimal timing'
                    ] : null
                };

            case 'Speaking':
                return {
                    prompts: [
                        {
                            main: 'What do you do? Do you work or are you a student?',
                            followups: [
                                'Why did you choose this job/course of study?',
                                'What do you enjoy most about your work/studies?',
                                'What are your future career plans?'
                            ]
                        },
                        {
                            main: 'Do you like reading books?',
                            followups: [
                                'What kinds of books do you prefer?',
                                'How often do you read?',
                                'Did you read a lot when you were a child?'
                            ]
                        },
                        {
                            main: 'Tell me about your hometown.',
                            followups: [
                                'What do you like most about living there?',
                                'Has your hometown changed much in recent years?',
                                'Would you like to live there in the future?'
                            ]
                        }
                    ],
                    durationNote: 'Part 1 typically lasts 4-5 minutes with 3-4 topics covered.'
                };

            case 'Mock Test':
                return {
                    composition: {
                        reading: { id: 'R001', title: 'Academic Reading - Climate Change', duration: '20 min' },
                        listening: { id: 'L001', title: 'Academic Lecture - Renewable Energy', duration: '30 min' },
                        writing: { id: 'W001', title: 'Task 2 - Transportation Infrastructure', duration: '40 min' },
                        speaking: { id: 'SP001', title: 'Part 1 - Personal Information', duration: '5 min' }
                    },
                    totalDuration: '2h 45m',
                    sections: 4
                };

            default:
                return null;
        }
    };

    const handleApply = () => {
        if (!generatedContent) {
            toast.error('Please generate content first');
            return;
        }

        onApply({
            content: generatedContent,
            metadata: {
                generatedBy: 'AI',
                generatedAt: new Date().toISOString(),
                parameters: formData
            }
        });

        toast.success('Generated content applied to draft');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-[800px] bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#253154]">AI Generate Content</h2>
                            <p className="text-xs text-gray-600">Generate structured content for this library item using AI. Review before saving.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">AI output will be added as Draft until you publish.</p>
                            <p className="text-xs text-blue-700 mt-1">Review generated content carefully before applying to ensure quality and accuracy.</p>
                        </div>
                    </div>

                    {/* Common Settings */}
                    <div className="space-y-6 mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-[#253154] mb-4">Common Settings</h3>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Exam Type */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Exam Type</label>
                                    <input
                                        type="text"
                                        value={currentData.exam}
                                        disabled
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                                    />
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Difficulty</label>
                                    <input
                                        type="text"
                                        value={currentData.difficulty}
                                        disabled
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                                    />
                                </div>

                                {/* Language */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Language</label>
                                    <Select value={formData.language} onValueChange={(value) => handleChange('language', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Spanish">Spanish</SelectItem>
                                            <SelectItem value="French">French</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Tone */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Tone/Style</label>
                                    <Select value={formData.tone} onValueChange={(value) => handleChange('tone', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Formal">Formal</SelectItem>
                                            <SelectItem value="Neutral">Neutral</SelectItem>
                                            <SelectItem value="Student-friendly">Student-friendly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Type-Specific Settings */}
                        {itemType === 'Reading' && (
                            <div>
                                <h3 className="text-sm font-bold text-[#253154] mb-4">Reading Content Settings</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Passage Length</label>
                                            <Select value={formData.passageLength} onValueChange={(value) => handleChange('passageLength', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="250">250 words</SelectItem>
                                                    <SelectItem value="500">500 words</SelectItem>
                                                    <SelectItem value="800">800 words</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Question Count</label>
                                            <Select value={formData.questionCount} onValueChange={(value) => handleChange('questionCount', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">10 questions</SelectItem>
                                                    <SelectItem value="15">15 questions</SelectItem>
                                                    <SelectItem value="20">20 questions</SelectItem>
                                                    <SelectItem value="40">40 questions</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-3">Question Types</label>
                                        <div className="space-y-2">
                                            {Object.entries({
                                                mcq: 'Multiple Choice Questions (MCQ)',
                                                trueFalse: 'True/False/Not Given',
                                                matching: 'Matching Headings',
                                                completion: 'Sentence Completion'
                                            }).map(([key, label]) => (
                                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.questionTypes[key as keyof typeof formData.questionTypes]}
                                                        onChange={() => handleQuestionTypeToggle(key)}
                                                        className="w-4 h-4 rounded border-gray-300 text-[#0e042f]"
                                                    />
                                                    <span className="text-sm text-gray-700">{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.includeExplanations}
                                                onChange={(e) => handleChange('includeExplanations', e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-[#0e042f]"
                                            />
                                            <span className="text-sm text-gray-700">Include explanations for answers</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.includeAnswerKey}
                                                onChange={(e) => handleChange('includeAnswerKey', e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-[#0e042f]"
                                            />
                                            <span className="text-sm text-gray-700">Include answer key</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {itemType === 'Listening' && (
                            <div>
                                <h3 className="text-sm font-bold text-[#253154] mb-4">Listening Content Settings</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Accent (Label Only)</label>
                                            <Select value={formData.accent} onValueChange={(value) => handleChange('accent', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Neutral">Neutral</SelectItem>
                                                    <SelectItem value="Indian">Indian</SelectItem>
                                                    <SelectItem value="UK">UK</SelectItem>
                                                    <SelectItem value="US">US</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Question Count</label>
                                            <Select value={formData.questionCount} onValueChange={(value) => handleChange('questionCount', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="10">10 questions</SelectItem>
                                                    <SelectItem value="15">15 questions</SelectItem>
                                                    <SelectItem value="20">20 questions</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <p className="text-xs text-amber-800">
                                            <strong>Note:</strong> Audio generation is not supported. A transcript will be generated. Upload audio file manually.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {itemType === 'Writing' && (
                            <div>
                                <h3 className="text-sm font-bold text-[#253154] mb-4">Writing Task Settings</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Task Type</label>
                                            <Select value={formData.taskType} onValueChange={(value) => handleChange('taskType', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Task 1">Task 1</SelectItem>
                                                    <SelectItem value="Task 2">Task 2</SelectItem>
                                                    <SelectItem value="SOP">Statement of Purpose</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Prompt Style</label>
                                            <Select value={formData.promptStyle} onValueChange={(value) => handleChange('promptStyle', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Academic">Academic</SelectItem>
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="Visa-focused">Visa-focused</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.includeSampleAnswer}
                                                onChange={(e) => handleChange('includeSampleAnswer', e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-[#0e042f]"
                                            />
                                            <span className="text-sm text-gray-700">Include sample answer</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.includeBandTips}
                                                onChange={(e) => handleChange('includeBandTips', e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-[#0e042f]"
                                            />
                                            <span className="text-sm text-gray-700">Include band tips</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {itemType === 'Speaking' && (
                            <div>
                                <h3 className="text-sm font-bold text-[#253154] mb-4">Speaking Set Settings</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Type</label>
                                            <Select value={formData.speakingType} onValueChange={(value) => handleChange('speakingType', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Part 1">Part 1 (Introduction)</SelectItem>
                                                    <SelectItem value="Part 2">Part 2 (Long Turn)</SelectItem>
                                                    <SelectItem value="Part 3">Part 3 (Discussion)</SelectItem>
                                                    <SelectItem value="Visa Interview">Visa Interview</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Number of Prompts</label>
                                            <Select value={formData.promptCount} onValueChange={(value) => handleChange('promptCount', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="3">3 prompts</SelectItem>
                                                    <SelectItem value="5">5 prompts</SelectItem>
                                                    <SelectItem value="7">7 prompts</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.includeFollowups}
                                            onChange={(e) => handleChange('includeFollowups', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#0e042f]"
                                        />
                                        <span className="text-sm text-gray-700">Include follow-up questions</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {itemType === 'Mock Test' && (
                            <div>
                                <h3 className="text-sm font-bold text-[#253154] mb-4">Mock Test Composition</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-2">Composition Strategy</label>
                                        <Select value={formData.mockComposition} onValueChange={(value) => handleChange('mockComposition', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Random from library">Random from library</SelectItem>
                                                <SelectItem value="Topic-aligned">Topic-aligned</SelectItem>
                                                <SelectItem value="Difficulty-balanced">Difficulty-balanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-3">Include Sections</label>
                                        <div className="space-y-2">
                                            {Object.entries({
                                                reading: 'Reading',
                                                listening: 'Listening',
                                                writing: 'Writing',
                                                speaking: 'Speaking'
                                            }).map(([key, label]) => (
                                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.includeSections[key as keyof typeof formData.includeSections]}
                                                        onChange={() => handleSectionToggle(key)}
                                                        className="w-4 h-4 rounded border-gray-300 text-[#0e042f]"
                                                    />
                                                    <span className="text-sm text-gray-700">{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    {hasGenerated && generatedContent && (
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle size={20} className="text-green-600" />
                                <h3 className="text-sm font-bold text-[#253154]">Generated Content Preview</h3>
                            </div>

                            <div className="space-y-3">
                                {/* Reading Preview */}
                                {itemType === 'Reading' && (
                                    <>
                                        <div className="border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => setPreviewExpanded({ ...previewExpanded, passage: !previewExpanded.passage })}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                                            >
                                                <span className="text-sm font-medium text-[#253154]">Passage ({formData.passageLength} words)</span>
                                                {previewExpanded.passage ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            </button>
                                            {previewExpanded.passage && (
                                                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                                                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedContent.passage}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => setPreviewExpanded({ ...previewExpanded, questions: !previewExpanded.questions })}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                                            >
                                                <span className="text-sm font-medium text-[#253154]">Questions ({generatedContent.questions.length})</span>
                                                {previewExpanded.questions ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            </button>
                                            {previewExpanded.questions && (
                                                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 space-y-3">
                                                    {generatedContent.questions.map((q: any, idx: number) => (
                                                        <div key={q.id} className="bg-white rounded-lg p-3 border border-gray-200">
                                                            <p className="text-xs font-semibold text-[#253154] mb-2">Q{idx + 1}. {q.questionText}</p>
                                                            <p className="text-xs text-gray-600"><strong>Type:</strong> {q.type}</p>
                                                            <p className="text-xs text-green-700 mt-1"><strong>Answer:</strong> {q.correctAnswer}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Listening Preview */}
                                {itemType === 'Listening' && (
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <h4 className="text-xs font-semibold text-[#253154] mb-2">Transcript</h4>
                                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedContent.transcript}</p>
                                    </div>
                                )}

                                {/* Writing Preview */}
                                {itemType === 'Writing' && (
                                    <>
                                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <h4 className="text-xs font-semibold text-[#253154] mb-2">Task Prompt</h4>
                                            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedContent.prompt}</p>
                                        </div>
                                        {generatedContent.sampleAnswer && (
                                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <h4 className="text-xs font-semibold text-[#253154] mb-2">Sample Answer</h4>
                                                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedContent.sampleAnswer}</p>
                                            </div>
                                        )}
                                        {generatedContent.bandTips && (
                                            <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                                                <h4 className="text-xs font-semibold text-[#253154] mb-2">Band Score Tips</h4>
                                                <ul className="space-y-1">
                                                    {generatedContent.bandTips.map((tip: string, idx: number) => (
                                                        <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                                                            <span className="text-blue-600 flex-shrink-0">•</span>
                                                            <span>{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Speaking Preview */}
                                {itemType === 'Speaking' && (
                                    <div className="space-y-3">
                                        {generatedContent.prompts.map((prompt: any, idx: number) => (
                                            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <p className="text-xs font-semibold text-[#253154] mb-2">Prompt {idx + 1}: {prompt.main}</p>
                                                {prompt.followups && (
                                                    <div className="mt-2 pl-3 border-l-2 border-purple-200">
                                                        <p className="text-xs font-medium text-gray-600 mb-1">Follow-up questions:</p>
                                                        <ul className="space-y-1">
                                                            {prompt.followups.map((followup: string, fIdx: number) => (
                                                                <li key={fIdx} className="text-xs text-gray-700">• {followup}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-xs text-blue-800">{generatedContent.durationNote}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Mock Test Preview */}
                                {itemType === 'Mock Test' && (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                                <p className="text-xs font-medium text-gray-600">Total Sections</p>
                                                <p className="text-lg font-bold text-[#253154]">{generatedContent.sections}</p>
                                            </div>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                <p className="text-xs font-medium text-gray-600">Total Duration</p>
                                                <p className="text-lg font-bold text-[#253154]">{generatedContent.totalDuration}</p>
                                            </div>
                                        </div>

                                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <h4 className="text-xs font-semibold text-[#253154] mb-3">Selected Sections</h4>
                                            <div className="space-y-2">
                                                {Object.entries(generatedContent.composition).map(([key, value]: [string, any]) => (
                                                    <div key={key} className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-700 font-medium capitalize">{key}:</span>
                                                        <span className="text-[#253154]">{value.title} ({value.duration})</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    {hasGenerated ? 'Regenerate' : 'Generate'}
                                </>
                            )}
                        </button>

                        {hasGenerated && (
                            <button
                                onClick={handleApply}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#0e042f] hover:bg-[#1a0c4a] text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                            >
                                <CheckCircle size={18} />
                                Apply Content
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
