import React, { useReducer, useState } from 'react';
import './App.scss';

function App() {
	interface Param {
		id: number,
		name: string,
	}
	interface ParamValue {
		paramId: number,
		value: string,
	}
	interface Model {
		paramValues: ParamValue[],
	}
	interface Props {
		params: Param[],
		model: Model,
		completedModel?: any,
	}
	interface Action {
		type: string,
		[propName: string]: any,
	}
	const params: Array<Param> = [
		{
			"id": 1,
			"name": "Назначение"
		},
		{
			"id": 2,
			"name": "Длина"
		}
	];
	const model: Model = {
		paramValues: [
			{
				"paramId": 1,
				"value": "повседневное"
			},
			{
				"paramId": 2,
				"value": "макси"
			}]
	}
	const initialState: Props = {
		params,
		model,

	}

	function reducer(state: Props, action: Action) {
		switch (action.type) {
			case 'changeModel':
				return {
					...state,
					model:
					{
						paramValues: action.updatedModel
					}
				};
			case 'addNewParameter':
				return {
					...state,
					params: [
						...state.params,
						{
							id: action.newId,
							name: action.newParameterInputValue
						}

					],

					model:
					{
						paramValues: [
							...state.model.paramValues,
							{
								paramId: action.newId,
								value: ""
							}

						]
					}
				};
			case 'deleteParameter':
				return {
					...state,
					params: state.params.filter(item => item.id != action.id),
					model: {
						paramValues:
							state.model.paramValues.filter(item => item.paramId != action.id)
					}
				};
			case 'getModel':
				return {
					...state,
					completedModel: action.completedModel
				}

			default:
				throw new Error();
		}
	}
	const [state, dispatch] = useReducer(reducer, initialState)
	const [newParameterInputValue, setNewParameterInputValue] = useState('');

	function deleteParam(id: number) {
		dispatch({ type: 'deleteParameter', id })
	}

	function getModel(event: React.MouseEvent<HTMLFormElement>) {

		event.preventDefault()


		const completedModel = state.params.map((item: any) => {
			const paramValue = state.model.paramValues.find((paramValue: any) => paramValue.paramId === item.id);



			return ({
				params: item.name,
				model: paramValue.value,
			})
		});
		dispatch({ type: 'getModel', completedModel })

	}


	function addParameter(e: any) {
		e.preventDefault()
		const allIds = Object.keys(state.params).map((item: any) => state.params[item].id + 1);
		const newId = Math.max.apply(null, allIds);
		dispatch({ type: "addNewParameter", newParameterInputValue, newId })
		setNewParameterInputValue('')
	}

	function changeModel(id: number, event: any) {
		const { target: { value: inputText } } = event;
		const updatedModel = state.model.paramValues.map((item: any) => ({
			"paramId": item.paramId,
			"value": item.paramId === id ? inputText : item.value
		}))
		dispatch({ type: "changeModel", updatedModel })
	}

	function handleInputChange(setState: Function, event: any) {
		const { target: { value: inputText } } = event;
		setState(inputText)
	}

	const modelsElement = state.model.paramValues.map((item: any) =>
		<input key={item.paramId}
			className="param-editor__model-value-input input"
			style={{ display: 'block' }}
			type="text"
			required
			maxLength={20}
			value={item.value}
			onChange={changeModel.bind(null, item.paramId)} />);


	const paramsElement = state.params.map(item =>
		<div className='param-editor__param-value' key={item.id} >
			<button className='param-editor__delete-button' onClick={deleteParam.bind(null, item.id)} >X</button>
			<p className='param-editor__param-name'>{item.name}</p>
		</div >
	)


	const completedModelElement = state.completedModel?.map((item: any) =>
		<div className="complited-model__row" key={`${Math.random()}${new Date()}`}>
			<span className="complited-model__param">{item.params}</span><span className="complited-model__model">{item.model}</span>
		</div>)

	return (
		<div className="param-editor">
			<div className="param-editor__container">
				<form onSubmit={getModel}>
					<div className="param-editor__configurator">
						<div className="param-editor__params">
							<div className="param-editor__param">{paramsElement}</div>
							<div className="param-editor__param-form param-form">
								<input type="text"
									className='param-form__input input'
									maxLength={25}
									value={newParameterInputValue}
									onChange={handleInputChange.bind(null, setNewParameterInputValue)}
								/>
								<button
									className='param-form__button button'
									disabled={newParameterInputValue == "" ? true : false}
									onClick={addParameter}>
									Добавить
								</button>
							</div>
						</div>
						<div className="param-editor__model-value">
							{modelsElement}
							<button className='param-editor__submit-button button' type="submit">Собрать модель</button>

						</div>
					</div>
				</form>

				<div className="param-editor__complited-model complited-model">
					{completedModelElement}
				</div>
			</div>
		</div>
	)
}

export default App;
