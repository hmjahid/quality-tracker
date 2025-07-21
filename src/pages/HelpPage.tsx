import React from 'react';

const HelpPage: React.FC = () => (
  <div style={{width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <h2>Help & Instructions</h2>
    <ul>
      <li><strong>Dashboard (Main Page):</strong> Add, edit, or delete task cards. Each card represents a project or task category. Click the card title to edit it. Set an optional deadline using the date picker.</li>
      <li><strong>Drag and Drop:</strong> You can reorder task cards on the main page by dragging them. Steps within each card can also be reordered by dragging the step handle, both on the main page and in Settings. This makes it easy to customize your workflow order.</li>
      <li><strong>Steps/Processes:</strong> Each card contains a list of steps. Mandatory steps are bold and colored. Add new steps, edit step text by clicking it, delete steps, and reorder steps by dragging them. Check steps as you complete them.</li>
      <li><strong>Progress Tracking:</strong> The progress bar shows completion. A card cannot be marked as "ready for next steps" unless all mandatory steps are checked. A message and color indicate if mandatory steps are incomplete.</li>
      <li><strong>Theme & Accessibility:</strong> Go to Settings to switch between System, Light, and Dark themes. Adjust font size for accessibility.</li>
      <li><strong>Default Steps:</strong> In Settings, configure default mandatory steps for each task type. New cards of that type will use your custom steps.</li>
      <li><strong>Notifications:</strong> Enable deadline reminders in Settings. You will be notified if a project deadline is approaching.</li>
      <li><strong>Data Export/Import:</strong> Backup your data as a JSON file or restore from a backup in Settings.</li>
      <li><strong>About:</strong> See app and developer info, and license, in the About page.</li>
    </ul>
    <p>If you need further help, contact the developer via the About page.</p>
  </div>
);

export default HelpPage; 