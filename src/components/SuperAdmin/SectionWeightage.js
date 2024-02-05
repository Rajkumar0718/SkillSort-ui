import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import { isEmpty } from '../../utils/Validation';
import { url } from '../../utils/UrlConstant';
import FormHelperText from '@mui/material/FormHelperText';


const SectionWeightage = () => {
	const [weightage, setWeightage] = useState({
		level1: '',
		level2: '',
		level3: '',
		scholarShip: '',
		status: 'ACTIVE',
	});
	const [screenShortTime, setScreenShortTime] = useState({});
	const [disabled, setDisabled] = useState(false);
	const [error, setError] = useState({
		level1: false,
		level2: false,
		level3: false,
		timer: false,
		scholarShip: false,
		simpleErrorMsg: '',
		mediumErrorMsg: '',
		complexErrorMsg: '',
		scholarShipErrorMsg: '',
		timerErrMsg: '',
	});

	useEffect(() => {
		axios.get(`${url.ADMIN_API}/section/weightage?status=ACTIVE`, { headers: authHeader() })
			.then((res) => {
				if (res.data.response) setWeightage(res.data.response);
			})
			.catch((err) => errorHandler(err));
		getScreenShotTimer();
	}, []);

	const getScreenShotTimer = () => {
		axios.get(`${url.ADMIN_API}/onlineTest/getScreenShortTimer?status=ACTIVE`, { headers: authHeader() })
			.then((res) => {
				if (res.data.response) setScreenShortTime(res.data.response);
			});
	};

	const handleChange = (event, key) => {
		const newWeightage = { ...weightage };
		const newError = { ...error };
		newWeightage[key] = event.target.value;
		newError[key] = false;
		setWeightage(newWeightage);
		setError(newError);
	};

	const handleTimerChange = (event, key) => {
		const newScreenShortTime = { ...screenShortTime };
		const newError = { ...error };
		newScreenShortTime[key] = event.target.value;
		newError[key] = false;
		setScreenShortTime(newScreenShortTime);
		setError(newError);
	};

	const handleSubmit = (event) => {
		const newError = { ...error };
		if (isEmpty(screenShortTime) || screenShortTime.screenShortTimer < 30) {
			newError.timer = true;
			newError.timerErrMsg = isEmpty(screenShortTime) ? 'Field Required !' : 'Enter at least 30 seconds';
			setError(newError);
		} else {
			newError.timer = false;
			setError(newError);
		}
		['level1', 'level2', 'level3', 'scholarShip'].forEach((key) => {
			if (isEmpty(weightage[key])) {
				newError[key] = true;
				newError[`${key}ErrorMsg`] = isEmpty(weightage[key]) ? 'Field Required !' : 'Enter Valid Input';
			} else {
				newError[key] = false;
			}
		});

		setDisabled(true);
		axios.post(`${url.ADMIN_API}/section/save/section_weightage`, weightage, { headers: authHeader() })
			.then(() => {
				setDisabled(false);
				toastMessage('success', 'Weightage added Successfully');
			})
			.catch((errorResponse) => {
				setDisabled(false);
				errorHandler(errorResponse);
			});
		saveScreenShortTime();
		event.preventDefault();
	};

	const saveScreenShortTime = () => {
		axios.post(`${url.ADMIN_API}/onlineTest/save-screenshort-timer`, screenShortTime, { headers: authHeader() })
			.then()
			.catch(() => {
				toastMessage('error', 'Error while saving screenShortTimer');
			});
	};

	const formFields = [
		{ label: 'Level 1', name: 'level1', type: 'tel', placeholder: 'Enter Weightage', value: weightage.level1 },
		{ label: 'Level 2', name: 'level2', type: 'tel', placeholder: 'Enter Weightage', value: weightage.level2 },
		{ label: 'Level 3', name: 'level2', type: 'tel', placeholder: 'Enter Weightage', value: weightage.level3 },
		{ label: 'Scholarship', name: 'level2', type: 'tel', placeholder: 'Enter Weightage', value: weightage.scholarShip },
		{ label: 'ScreenShot Time', name: 'level2', type: 'tel', placeholder: 'Enter Weightage', value:screenShortTime.screenShortTimer},
	];

	return (
		<div>
			<>
				<main className="main-content bcg-clr">
					<div>
						<div className="container-fluid cf-1">
							<div className="card-header-new">
								<span>
									Weightage
								</span>
							</div>
							<div className="row">
								<div className="col-md-12">
									<div className="table-border">
										<form className="email-compose-body" onSubmit={handleSubmit} >
											<div className="send-header">
												<div className="row" style={{marginLeft:"1px"}}>
													{formFields.map((field, index) => (
														<div className="col-lg-6 col-6 col-sm-6 col-md-6 col-xl-6" key={index}>
															<div className="row">
																<div className="col-4 col-sm-4 col-md-4 col-lg-4">
																	<label className="form-label input-label" htmlFor={field.name}>{field.label}<span className='required'></span>
																		<FormHelperText className="helper" style={{ paddingLeft: "0px" }}>{error[field.name] ? error[field.name + 'ErrorMsg'] : null}</FormHelperText>
																	</label>
																</div>
																<div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
																	<input type={field.type} className="profile-page" onChange={(e) => handleChange(e, field.name)} value={field.value} name={field.name} autoComplete="off" placeholder={field.placeholder} />
																</div>
															</div>
														</div>
													))}
												</div>
												<div className="form-group row" >
													<div className="col-md-11 col-lg-11 col-sm-11 col-11" style={{ paddingRight: '2.5rem' }}>
														<button disabled={disabled} style={{ float: 'right' }} type="submit" className="btn btn-sm btn-prev">{weightage.id ? "Update" : "Add"}
														</button>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</>
		</div>
	)
}
export default SectionWeightage;