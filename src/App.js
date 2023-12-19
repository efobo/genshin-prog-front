import { useMemo, useState } from 'react';
import './App.css';
import { Authorization } from './components/Authorization';
import { History } from "./components/History";
import { useCookies } from 'react-cookie';
function App() {
    const [loginCookie, , removeLoginCookie] = useCookies(['genshin-login-cookie']);
    const [error, setError] = useState('');

    const content = useMemo(() =>
        loginCookie['genshin-login-cookie']
            ? (<History token={loginCookie['genshin-login-cookie']} setError={setError} />)
            : (<Authorization error={error} setError={setError} />),
        [loginCookie, error, setError]);

    return (
        <body>
            <div className="header">
                <div className="logo"></div>
                <h1>Prayers Predictor</h1>
                <div className="plug">
                    {loginCookie['genshin-login-cookie'] && (
                        <input
                            className="log-out-button"
                            type="button"
                            value="Log out"
                            onClick={() => removeLoginCookie(['genshin-login-cookie'])}
                        />
                    )}
                </div>
            </div>
            {content}
        </body>
    );
}

export default App;
