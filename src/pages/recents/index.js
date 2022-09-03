import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { getRecentUpdates } from "../../redux/actions/recents";
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs';
import useDidUpdateEffect from '../../helper/useDidUpdateEffect';
import { useRouter } from 'next/router';
dayjs.extend(relativeTime)

const Recents = (props) => {
  const {
    getRecentUpdates,
    recents,
    isRecentsLoading
  } = props
  const router = useRouter();

  const [recentsState, setRecentsState] = useState(null)
  let storageData = typeof window !== 'undefined' ?? localStorage.getItem("active_user_data")
    ? JSON.parse(localStorage.getItem("active_user_data"))
    : {};

  const camalize = (str) => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }
  const handleRouting = (type, data) => {
    const name = camalize(data.name)
    router.push({ pathname: `/${type}/${name}`, query: data });
  }

  useEffect(() => {
    console.log("HERE 1")
    if (!recents) {
      console.log("HERE 2", storageData.login_user_id)
      getRecentUpdates(storageData.login_user_id);
    } else {
      setRecentsState(recents)
    }
  }, [])
  useDidUpdateEffect(() => {
    if (recents) {
      setRecentsState(recents)
    }
  }, [recents])

  return (
    <React.Fragment>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <span className="h4 mb-0 text-gray-800">Recent Updates</span>
      </div>
      <hr />
      <div>
        <div className="container">
          {isRecentsLoading && (
            <div className="home_recents-item text-center" style={{ height: '310px' }}>
              <div class="loader text-center">
                <span class="span"></span>
              </div>

            </div>
          )}
        </div>
        <div className="row">
          {recentsState && recentsState.map((item, i) => {
            return (
              <div className="col-4">
                {true ? (
                  <div className="home_recents-item" key={i}
                    onClick={() => handleRouting((item.type).toLowerCase(), item)}>
                    <span>
                      <img src="/images/Copy.png" alt="copy icon" />
                    </span>
                    <div className="home_recents-text" style={{ color: "#6c757d" }}>
                      <div>{item.name}</div>
                      <span>{item.type}: Updated {dayjs(item.recent_date).fromNow()}</span>
                    </div>
                  </div>
                ) : ""}
              </div>
            )
          })}
        </div>
      </div>

    </React.Fragment>

  );
}

const mapStateToProps = (store) => {
  return {
    recents: store.recents.recents,
    isRecentsLoading: store.recents.isLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRecentUpdates: (params) => dispatch(getRecentUpdates(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Recents);
