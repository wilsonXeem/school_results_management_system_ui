import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import "./sessions.css";
import Levels from "./components/Levels";
import PreviousSession from "./components/PreviousSession";
import Loader from "../../../components/Loader";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:1234";

// Cache for sessions data
const sessionsCache = new Map();
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

function Sessions() {
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [session, setSession] = useState("");
  const [current, setCurrent] = useState(false);
  const [current_session, setCurrent_session] = useState([]);
  const [other_sessions, setOther_sessions] = useState([]);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchSessions = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'sessions';
    const now = Date.now();
    
    // Check cache first
    if (!forceRefresh && sessionsCache.has(cacheKey)) {
      const cached = sessionsCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        const { current_sessions, other_sessions } = cached.data;
        setCurrent_session(current_sessions);
        setOther_sessions(other_sessions);
        if (current_sessions.length === 0) {
          setShow(true);
        }
        return;
      }
    }
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setLoad(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      
      if (json.success) {
        const current_sessions = json.sessions.filter((session) => session.current === true);
        const other_sessions = json.sessions.filter((session) => session.current === false);
        
        setCurrent_session(current_sessions);
        setOther_sessions(other_sessions);
        
        // Cache the processed data
        sessionsCache.set(cacheKey, {
          data: { current_sessions, other_sessions },
          timestamp: now
        });
        
        if (json.sessions.length < 1) {
          setShow(true);
        }
      } else {
        throw new Error('Failed to fetch sessions');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      console.error('Failed to fetch sessions:', err);
      setError(err.message);
    } finally {
      setLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchSessions]);

  const register_session = useCallback(async () => {
    if (!session.trim()) {
      setError('Please enter a session name');
      return;
    }
    
    setLoad(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: session.trim(),
          current,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      
      // Clear cache and refresh data
      sessionsCache.clear();
      await fetchSessions(true);
      
      // Reset form
      setSession('');
      setCurrent(false);
      setShow(false);
    } catch (err) {
      console.error('Failed to register session:', err);
      setError(err.message);
    } finally {
      setLoad(false);
    }
  }, [session, current, fetchSessions]);
  
  const currentSessionData = useMemo(() => {
    return current_session.length > 0 ? current_session[0] : null;
  }, [current_session]);

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div className="error-message" style={{ color: "red" }}>
          <h3>Error loading sessions</h3>
          <p>{error}</p>
          <button onClick={() => fetchSessions(true)} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <h2>Course registration</h2>
      </div>
      {load && <Loader />}
      <div className="current_session">
        <p>Current session:</p>
        {currentSessionData && <h2>{currentSessionData.session}</h2>}
        <div>
          <button onClick={() => setShow(true)} disabled={load}>Register new session</button>
        </div>
      </div>
      {show && (
        <div className="register_session">
          <p>Register session:</p>
          <input
            type="text"
            placeholder="Session (e.g., 2023-2024)"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            disabled={load}
          />
          <label htmlFor="current">Current session:</label>
          <input
            type="checkbox"
            name="current"
            id="current"
            checked={current}
            onChange={() => setCurrent(!current)}
            disabled={load}
          />
          <button onClick={register_session} disabled={load || !session.trim()}>Submit</button>
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => { setShow(false); setSession(''); setCurrent(false); setError(null); }}
            disabled={load}
          >
            Cancel
          </button>
        </div>
      )}
      {currentSessionData && (
        <Levels
          classes={currentSessionData.classes || []}
          session={currentSessionData.session}
        />
      )}
      <div className="previous_sessions_container">
        <p>Other sessions:</p>
        {other_sessions.length > 0 && (
          <div className="previous_sessions">
            {other_sessions.map((session, index) => (
              <PreviousSession key={session.session || index} session={session.session} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default React.memo(Sessions);
