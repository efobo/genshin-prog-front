import React, {useCallback, useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import {useCookies} from "react-cookie";


export const History = ({ token, setError }) => {

    const [, , removeLoginCookie] = useCookies(['genshin-login-cookie']);

    const [cookies] = useCookies(['username-cookie']);
    const usernameCookie = cookies['username-cookie'];

    const [proba, setProba] = useState([]);
    const [historyState, setHistory] = useState([]);
    const [probaNum, setProbaNum] = useState([]);
    const [num, setNum] = useState('');
    const [setPrayer, setSetPrayer] = useState({
        name: "",
        rang: "THREE_STAR",
        userName: `${usernameCookie}`
    });

    useEffect(() => {
        console.log('Значение куки:', usernameCookie);
    }, [usernameCookie]);


    const handleName = useCallback((event) => {
        event.preventDefault();
        setSetPrayer({ name: event.target.value, rang: setPrayer.rang, userName: `${usernameCookie}` });
    }, [setSetPrayer, setPrayer, usernameCookie]);

    const handleRang = useCallback((event) => {
        event.preventDefault();
        setSetPrayer({ name: setPrayer.name, rang: event.target.value, userName: `${usernameCookie}`  });
    }, [setSetPrayer, setPrayer, usernameCookie]);

    const handleProbNum = useCallback((event) => {
        event.preventDefault();
        setNum(event.target.value);
    }, [setNum]);

    const handleError = useCallback((status) => {
        setError(`Error: ${status}`);
        removeLoginCookie(['genshin-login-cookie']);
    }, [setError, removeLoginCookie]);

    const showHistory = useCallback(() => {
        axios.get(`http://localhost:8082/api/main/get-history/${usernameCookie}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                const reversedHistory = [...response.data].reverse();
                setHistory(reversedHistory)})
            .catch(err => handleError(err.response.status));
    }, [setHistory, token, handleError, usernameCookie]);

    const showProbaNum = useCallback((event) => {
        event.preventDefault();
        axios.get(`http://localhost:8082/api/main/get-probabilities/${num}/${usernameCookie}`)
            .then((response) => setProbaNum(response.data))
            .catch(err => handleError(err.response.status));
    }, [num, setProbaNum, handleError, usernameCookie]);

    const addPrayer = useCallback((event) => {
        event.preventDefault();
        let url = 'http://localhost:8082/api/main/add-prayer'
        axios.post(url, setPrayer, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setProba(response.data);
                showHistory();
            })
            .catch(err => handleError(err.response.status));
    }, [setPrayer, setProba, token, showHistory, handleError]);

    const handleDelete = useCallback((id) => {
        axios.delete(`http://localhost:8082/api/main/delete/${id}`)
            .then(() => {
                showHistory();
            })
            .catch(err => handleError(err.response.status));
    }, [showHistory, handleError]);

    const history = historyState.map((item, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.rang}</td>
            <td>{item.date}</td>
            <td className="delButtonTable">
                <button className="delButton" onClick={() => handleDelete(item.id)}>&#10006;</button>
            </td>
        </tr>));

    const fourNum = probaNum.map(item => (<span className="text"> {item.fourStarProbability}%</span>));

    const fiveNum = probaNum.map(item => (<span className="text"> {item.fiveStarProbability}%</span>));

    const four = proba.map(item => (<span className="text"> {item.fourStarProbability}%</span>));

    const five = proba.map(item => (<span className="text"> {item.fiveStarProbability}%</span>));

    return (
        <div className="main">
            <div className="mainhd">
                <form className="forma">
                    <input className="input" type="text" placeholder="name" value={setPrayer.name}
                        onChange={handleName} />
                    <select className="select" value={setPrayer.rang} onChange={handleRang}>
                        <option value="THREE_STAR">3&#9733;</option>
                        <option value="FOUR_STAR">4&#9733;</option>
                        <option value="FIVE_STAR">5&#9733;</option>
                    </select>
                    <button className="button" onClick={addPrayer}>add</button>
                    <button className="button" onClick={e => {
                        e.preventDefault();
                        showHistory();
                        }}>show</button>
                </form>

                <div className="probabilityContainer">
                    <div className="fourProbability">
                        <span className='text'>
                            Chance of a 4&#9733; falling out on the next spin: {four}
                        </span>
                    </div>
                    <div className="fiveProbability">
                        <span className='text'>
                            Chance of a 5&#9733; falling out on the next spin: {five}
                        </span>
                    </div>
                </div>

                <form className="forma2">
                    <input type="number" min="1" className="input2" placeholder="attempts" value={num}
                        onChange={handleProbNum} />
                    <button className="button2" onClick={showProbaNum}>prob</button>
                </form>

                <div className="probabilityContainer">
                    <div className="fourProbability">
                        <span className='text'>
                            Chance of a 4&#9733; falling out after {num} spins: {fourNum}
                        </span>
                    </div>
                    <div className="fiveProbability">
                        <span className='text'>
                            Chance of a 5&#9733; falling out after {num} spins: {fiveNum}
                        </span>
                    </div>
                </div>

            </div>
            <div className='tableContainer'>
                <Table className="tableOutput">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Name</th>
                            <th>Rang</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history}
                    </tbody>
                </Table>
            </div>

        </div>);
}