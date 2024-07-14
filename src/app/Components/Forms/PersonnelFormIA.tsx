import React, { useState } from "react";

const PersonnelFormIA: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ocr/extract-ocr/`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        setResult(data);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Extract with OCR</button>
            </form>
            {result && (
                <div>
                    <p>Nom: {result.nom}</p>
                    <p>Prénom: {result.prenom}</p>
                    <p>Numéro CIN: {result.num_cin}</p>
                    <p>Login Email: {result.email}</p>
                    <p>Password: {result.password}</p>
                </div>
            )}
        </div>
    );
};

export default PersonnelFormIA;
