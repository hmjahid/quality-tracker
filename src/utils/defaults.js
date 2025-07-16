export const DEFAULT_MANDATORY_STEPS = {
    'WordPress Development': [
        'Initial Setup',
        'Theme Installation',
        'Plugin Configuration',
        'QC Review',
        'Final Submission',
    ],
    'Custom Theme Development': [
        'Design Approval',
        'Theme Coding',
        'Testing',
        'QC Review',
        'Final Submission',
    ],
    'Maintenance': [
        'Backup',
        'Update Plugins',
        'Security Check',
        'QC Review',
        'Final Submission',
    ],
    'SEO Audit': [
        'Site Crawl',
        'Keyword Analysis',
        'On-Page Review',
        'QC Review',
        'Final Submission',
    ],
    'Content Writing': [
        'Topic Research',
        'Draft Writing',
        'Editing',
        'QC Review',
        'Final Submission',
    ],
};
export function createDefaultSteps(type) {
    return (DEFAULT_MANDATORY_STEPS[type] || []).map((label, idx) => ({
        id: `${type}-step-${idx}`,
        label,
        completed: false,
        mandatory: true,
    }));
}
export const DEFAULT_WORK_TYPES = Object.keys(DEFAULT_MANDATORY_STEPS).map((type, idx) => ({
    id: `default-${idx}`,
    title: type,
    steps: createDefaultSteps(type),
}));
