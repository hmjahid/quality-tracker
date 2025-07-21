import React from 'react';

const AboutPage: React.FC = () => (
  <div style={{width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <h2>About QualityTracker</h2>
    <p>Developed By Md Jahid Hasan.</p>
    <p>Email: mdjahidhasan919@gmail.com</p>
    <p>Website: <a href="https://hmjahid.netlify.app/" target="_blank" rel="noopener noreferrer">hmjahid.netlify.app</a></p>
    <p>LinkedIn: <a href="https://linkedin.com/in/hmjahid/" target="_blank" rel="noopener noreferrer">linkedin.com/in/hmjahid</a></p>
    <p>GitHub: <a href="https://github.com/hmjahid/" target="_blank" rel="noopener noreferrer">github.com/hmjahid</a></p>
    <h3>License (Non-Commercial Use Only)</h3>
    <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14, color: '#c62828', fontWeight: 600, background: '#fff3e0', padding: 12, borderRadius: 8, marginTop: 8 }}>
      {`This software is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).

You are free to share and adapt the software for non-commercial purposes, provided that you give appropriate credit.

COMMERCIAL USE OF THIS SOFTWARE IS STRICTLY PROHIBITED WITHOUT EXPLICIT PERMISSION FROM THE AUTHOR.

For more details, see: https://creativecommons.org/licenses/by-nc/4.0/`}
    </pre>
  </div>
);

export default AboutPage; 