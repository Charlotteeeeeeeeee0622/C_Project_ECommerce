import React from 'react';
import PropTypes from 'prop-types';

const Content = ({ children }) => {
  return (
    <div className="content">
      <div className="container">{children}</div>
    </div>
  );
};

Content.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Content;
