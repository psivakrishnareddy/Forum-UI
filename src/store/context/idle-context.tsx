/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import IdleModal from '../../components/common/UI/IdleModal/IdleModal'
import storage from '../../utils/storage'
import GlobalContext from './global-context';
import { SET_CONTINUE } from '../Types/GlobalTypes';
const IdleComponentContainer: React.FC = () => {
  const { state,dispatch } = React.useContext(GlobalContext);
  let token: boolean = false;
  if (storage.getToken() != null) {
    token = true;
  }
  else {
    token = false;
  }

const inactiveTime = () => {

    const idleDurationSecs = 900;    //  15 mins idle time X number of seconds
    let idleTimeout: string | number | NodeJS.Timeout | undefined; // variable to hold the timeout, do not modify
    clearTimeout(idleTimeout);
    const resetIdleTimeout = function() {

        // Clears the existing timeout
        if(idleTimeout)
        {
          // for(var i = 0; i<= idleTimeout;i++){
          //   clearTimeout(i);
          // }
          clearTimeout(idleTimeout);
        } 

        // Set a new idle timeout to load the redirectUrl after idleDurationSecs
        idleTimeout = setTimeout(() => dispatch({ type: SET_CONTINUE, payload: true }), idleDurationSecs * 1000);
    };
    resetIdleTimeout();
    // Reset the idle timeout on any of the events listed below
    ['click', 'touchstart', 'mousemove'].forEach(evt => 
        document.addEventListener(evt, resetIdleTimeout, false)
    );

};

  useEffect(() => {
    inactiveTime();
  })
  return (
    <div>
      <div>
        {state?.isContinue && token && <IdleModal></IdleModal>}
      </div>
      <div>
      </div>
    </div>
  )
}
export default IdleComponentContainer