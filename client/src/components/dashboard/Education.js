import React, { Fragment } from "react";
import { connect } from "react-redux";
// moment helps to format dates
import Moment from "react-moment";
import Proptypes from "prop-types";
import { deleteEducation } from "../../actions/profile";

const Education = ({ education, deleteEducation }) => {
  const educationlist = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className='hide-sm'>{edu.degree}</td>
      <td>
        <Moment format='YYYY//MM/DD'>{edu.from}</Moment> -{""}
        {edu.to === null ? (
          " Now "
        ) : (
          <Moment format='YYYY/MM/DD'>{edu.to}</Moment>
        )}
      </td>
      <td>
        <button
          onClick={() => deleteEducation(edu._id)}
          className='btn btn-danger'
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
          </tr>
        </thead>
        <tbody>{educationlist}</tbody>
      </table>
    </Fragment>
  );
};
Education.propTypes = {
  education: Proptypes.array.isRequired,
  deleteEducation: Proptypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
