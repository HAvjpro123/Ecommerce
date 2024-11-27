import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS của Quill

// Modules của Quill, bao gồm công cụ chèn ảnh
const modules = {
    toolbar: [
        [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'video'], // Nút chèn ảnh
        ['clean'] // Nút làm sạch format
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image', 'video'
];

const TextEditor = () => {
    const [content, setContent] = useState('');

    // Hàm xử lý khi nội dung thay đổi
    const handleContentChange = (value) => {
        setContent(value);
    };

    return (
        <div>
            <ReactQuill 
                value={content} 
                onChange={handleContentChange} 
                modules={modules}
                formats={formats}
                placeholder="Nhập nội dung ở đây..."
            />
            <div className="preview">
                <h3>Xem trước nội dung:</h3>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
};

export default TextEditor;
