import React, { useCallback, useMemo, useState } from "react";
import "./Authorization.css"
import { useCookies } from "react-cookie";
import { SmartCaptcha } from '@yandex/smart-captcha';


export const Authorization = ({ error, setError }) => {

    const [, setLoginCookie] = useCookies(['genshin-login-cookie']);
    const [, setUserNameCookie] = useCookies(['username-cookie']);

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');

    const areCredsValid = useMemo(() => login.length >= 4 && login.length <= 20 && password.length >= 4,
        [login, password]);

    const handleCaptchaSuccess = (newToken) => {
        console.log("Captcha token:", newToken);
        setCaptchaToken(newToken);
    };

    const onAuth = useCallback(() => {
        // Check if captchaToken is empty
        if (!captchaToken) {
            setError("Please complete the captcha");
            return;
        }

        fetch("http://localhost:8082/api/auth/login/", {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: login,
                password: password,
                captchaToken: captchaToken,
            }),
        }).then(async response => {
            if (response.status === 200) {
                setError('');
                return response.text();
            } else {
                setError(`Error: ${response.status}`);
                const err = new Error(response.status)
                console.log(err);
                const message = await response.text();
                setError(prev => `${prev} - ${message}`);
                throw err;
            }
        }).then(token => {
            setLoginCookie('genshin-login-cookie', token, { maxAge: 600 });
            setUserNameCookie('username-cookie', login, {maxAge:600})
        }).catch(err => {
            console.log(err);
        });
    }, [setLoginCookie, setUserNameCookie, login, password, captchaToken, setError]);

    const onRegister = useCallback(() => {

        if (!captchaToken) {
            setError("Please complete the captcha");
            return;
        }

        fetch("http://localhost:8082/api/auth/register/", {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: login,
                password: password,
                captchaToken: captchaToken,
            }),
        }).then(async response => {
            if (response.status === 200) {
                setError('');
                return response.text();
            } else {
                setError(`Error: ${response.status}`);
                const err = new Error(response.status)
                console.log(err);
                const message = await response.text();
                setError(prev => `${prev} - ${message}`);
                throw err;
            }
        }).then(token => {
            setLoginCookie('genshin-login-cookie', token, { maxAge: 600 });
            setUserNameCookie('username-cookie', login, {maxAge:600})
        }).catch(err => console.log(err));
    }, [login, password, setLoginCookie, setUserNameCookie, captchaToken, setError]);

    return (
        <div className="auth-form">
            <span className="auth-form-title">Authorization form</span>
            <input
                className="auth-form-input"
                placeholder="Nickname"
                value={login}
                onChange={event => setLogin(event.target.value)} />
            <input
                type="password"
                className="auth-form-input"
                placeholder="Password"
                value={password}
                onChange={event => setPassword(event.target.value)} />
            {error !== '' && (
                <span className="auth-form-error">{error}</span>
            )}
            <SmartCaptcha
                sitekey="ysc1_17CMeLEfeZVa2hL5jfXbiUhlaqMtL2smMg8TaA9z81f46b23"
                onSuccess={handleCaptchaSuccess}
            />
            <div className="auth-form-button-container">
                <input
                    type="button"
                    disabled={!areCredsValid}
                    className="auth-form-button"
                    value="Authorization"
                    onClick={onAuth} />
                <input
                    type="button"
                    disabled={!areCredsValid}
                    className="auth-form-button"
                    value="Registration"
                    onClick={onRegister}
                />
            </div>
        </div>
    );
}