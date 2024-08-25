import React, { useState } from 'react';

function SHA256ConverterAndChecker() {
    const [nameInput, setNameInput] = useState('');
    const [checkInput, setCheckInput] = useState('');
    const [hash, setHash] = useState('');
    const [message, setMessage] = useState('');

    const convertToSHA256 = async (input) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleNameInputChange = (event) => {
        setNameInput(event.target.value);
    };

    const handleCheckInputChange = (event) => {
        setCheckInput(event.target.value);
    };

    
    const handleConvertAndSave = async () => {
        const generatedHash = await convertToSHA256(nameInput);
        setHash(generatedHash);

       
        const response = await fetch('http://localhost:5000/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nameInput, hash: generatedHash }),
        });
        const result = await response.json();
        setMessage(result.message);
    };

    
    const checkMatch = async () => {
        const response = await fetch('http://localhost:5000/api/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: checkInput }),
        });
        const result = await response.json();
        setMessage(result.message);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>SHA-256 Hash Converter & Checker</h1>

            {/* Section 1: Convert Name to Hash */}
            <div>
                <h2>Convert Name to SHA-256 Hash & Save</h2>
                <input
                    type="text"
                    value={nameInput}
                    onChange={handleNameInputChange}
                    placeholder="Enter your name"
                    style={{ padding: '10px', fontSize: '16px', width: '300px' }}
                />
                <br />
                <button
                    onClick={handleConvertAndSave}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Convert and Save
                </button>
                <p style={{ marginTop: '20px', fontSize: '18px' }}>
                    <strong>SHA-256 Hash:</strong> {hash}
                </p>
                <p style={{ marginTop: '20px', fontSize: '18px' }}>
                    {message}
                </p>
            </div>

            {/* Section 2: Check Name or Hash in JSON */}
            <div style={{ marginTop: '50px' }}>
                <h2>Check Name or Hash in JSON</h2>
                <input
                    type="text"
                    value={checkInput}
                    onChange={handleCheckInputChange}
                    placeholder="Enter name or hash"
                    style={{ padding: '10px', fontSize: '16px', width: '300px' }}
                />
                <br />
                <button
                    onClick={checkMatch}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    Check Match
                </button>
                <p style={{ marginTop: '20px', fontSize: '18px' }}>
                    {message}
                </p>
            </div>
        </div>
    );
}

export default SHA256ConverterAndChecker;
