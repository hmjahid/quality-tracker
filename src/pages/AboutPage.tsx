import React from 'react';

const AboutPage: React.FC = () => (
  <div style={{width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <h2>About QualityTracker</h2>
    <p>Developed By Md Jahid Hasan.</p>
    <p>Email: mdjahidhasan919@gmail.com</p>
    <p>Website: <a href="https://hmjahid.netlify.app/" target="_blank" rel="noopener noreferrer">hmjahid.netlify.app</a></p>
    <p>LinkedIn: <a href="https://linkedin.com/in/hmjahid/" target="_blank" rel="noopener noreferrer">linkedin.com/in/hmjahid</a></p>
    <p>GitHub: <a href="https://github.com/hmjahid/" target="_blank" rel="noopener noreferrer">github.com/hmjahid</a></p>
    <h3>Open Source License</h3>
    <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
MIT License

Copyright (c) {new Date().getFullYear()} Md Jahid Hasan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    </pre>
  </div>
);

export default AboutPage; 