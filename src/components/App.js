import React from 'react';

import { recursiveTreversalTree } from '../utils';

import './app.css';


export default class App extends React.Component {

    state = {
        isActive: false,
        error: false,
        result: 0,
        errorMessage: ''
    };

    onChange = (event) => {
        this.handleFiles(event.target.files);
    };

    preventDefaultes = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };

    dragEnter = (e) => {
        this.preventDefaultes(e);
        this.setState({ isActive: true });
    };

    dragLeave = (e) => {
        this.preventDefaultes(e);
        this.setState({ isActive: false });
    };

    drop = (e) => {
        this.preventDefaultes(e);
        this.handleFiles(e.dataTransfer.files);
        this.setState({ isActive: false });

    };

    setErrorState = errorMessage => {
        this.setState({
            errorMessage,
            error: true
        });
    }

    onReaderLoad = ({ target }) => {
        // Я не уверен как правильнее проверить что данные закодированны в base64
        const jsonType = /\/json;base64/i;
        let obj;

        try {
            if (!jsonType.test(target.result)) {
                obj = JSON.parse(target.result);
            } else {
                // Decode base64
                const decodeData = window.atob(target.result.split(',')[1]);
                obj = JSON.parse(decodeData);
            }
        } catch (err) {
            this.setErrorState('JSON файл не валидный!');
            return;
        }

        this.setState({
            result: recursiveTreversalTree(obj),
            error: false
        });
    };

    handleFiles(files) {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            throw Error('File API не поддерживается вашим браузером!');
        }

        const jsonType = /\/json$/i;
        const LIMIT_SIZE = 1000000; // ~1Mb

        Array.from(files).forEach(file => {

            if (file.size > LIMIT_SIZE) {
                this.setErrorState('Размер файла слишком велик!');
                return;
            }

            if (!jsonType.test(file.type)) {
                this.setErrorState('Недоспустимый формат файла');
                return;
            }

            const reader = new FileReader();
            reader.onload = this.onReaderLoad;
            reader.readAsDataURL(file);
        });
    }

    render () {
        const {
            isActive,
            error,
            errorMessage,
            result
        } = this.state;

        const dropboxClassname = `dropbox ${isActive ? 'highlight': ''}`;

        return (
            <div className="container">
                <p className="desc">
                    Нужно загрузить json файл (в том числе с использованием drag and drop).
                    Если формат json верный, то рекурсивно посчитает и отобразит число объектов,
                    если нет – сообщение об ошибке.
                </p>
                <div className={dropboxClassname}
                     onDragEnter={this.dragEnter}
                     onDragOver={this.preventDefaultes}
                     onDragLeave={this.dragLeave}
                     onDrop={this.drop}
                >
                    <form>
                        <label htmlFor="file" className="upload-file">
                            <span className="upload-file__title">Выбрать файл для загрузки</span>
                            <i className="upload-icon"></i>
                            <input type="file"
                                   id="file"
                                   name="files"
                                   multiple
                                   onChange={this.onChange}
                            />
                        </label>
                    </form>
                </div>
                {
                    error
                        ? <h1 className="result result-error">{errorMessage}</h1>
                        : <h1 className="result">Количество объектов: <span>{result}</span></h1>
                }
            </div>
        );
    }
}
