import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '@mui/material/styles';
const AboutPage = () => {
  const theme = useTheme();
  const linkStyle = {
    color: theme.palette.mode === 'dark' ? '#fff' : theme.palette.primary.main,
    textDecoration: 'underline',
    fontWeight: 500,
    transition: 'color 0.2s',
  };
  return (
    <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>About QualityTracker</h2>
      <p>Developed By Md Jahid Hasan.</p>
      <p>Email: mdjahidhasan919@gmail.com</p>
      <p>Website: <a href="https://hmjahid.netlify.app/" target="_blank" rel="noopener noreferrer" style={linkStyle}>hmjahid.netlify.app</a></p>
      <p>LinkedIn: <a href="https://linkedin.com/in/hmjahid/" target="_blank" rel="noopener noreferrer" style={linkStyle}>linkedin.com/in/hmjahid</a></p>
      <p>GitHub: <a href="https://github.com/hmjahid/" target="_blank" rel="noopener noreferrer" style={linkStyle}>github.com/hmjahid</a></p>
      <h3>License (Non-Commercial Use Only)</h3>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
        {`This software is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).

You are free to share and adapt the software for non-commercial purposes, provided that you give appropriate credit.

Commercial use of this software is strictly prohibited without explicit permission from the author.

For more details, see: https://creativecommons.org/licenses/by-nc/4.0/`}
      </pre>
    </div>
  );
};
export default AboutPage;
