"use client";

import { useState } from "react";

type Message = {
  id: number;
  text: string;
  time: string;
  sent: boolean;
  status?: string;
};

const messages: Message[] = [
  { id: 1, text: "", time: "10:21 AM", sent: true, status: "Sent" },
  { id: 2, text: "Sure", time: "10:22 AM", sent: false },
  { id: 3, text: "Head's up, we might need to cancel the evening meeting.", time: "10:22 AM", sent: false },
  { id: 4, text: "We can do it tomorrow. Just ping me whenever you are done.", time: "10:34 AM", sent: true, status: "Sent" },
  { id: 5, text: "Sounds good.", time: "1:12 PM", sent: true, status: "Sent" },
];

export default function ChatArea() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col flex-1 h-full" style={{ backgroundColor: 'var(--th-bg)' }}>
      {/* Chat header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: 'var(--th-border)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h2
              className="text-base font-semibold"
              style={{ color: 'var(--th-text-primary)' }}
            >
              Jim Dowell
            </h2>
            <button>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--th-text-primary)' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CCCFD2" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: 'var(--th-text-muted)' }}>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#34C759]" />
              Online
            </span>
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
              0
            </span>
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Add chat description
            </span>
          </div>
        </div>
        <div className="flex items-center gap-[13px]">
          {/* Meet icon */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--th-icon-fill)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="20" height="20" viewBox="0 0 31 32" fill="none"><path d="M24.8047 12.3957C24.5345 11.8045 23.8725 11.4548 23.2419 11.6123C22.7634 11.7317 22.2509 12.0093 21.715 12.3704C21.4735 12.5332 21.3667 12.8295 21.4434 13.1104C21.9673 15.0343 21.9673 16.9655 21.4434 18.8894C21.3667 19.1703 21.4735 19.4673 21.715 19.6295C22.2516 19.9905 22.7641 20.2681 23.2425 20.3875C23.8732 20.545 24.5351 20.1947 24.8054 19.6034C25.7316 17.5748 25.7316 14.425 24.8047 12.3957ZM7.45775 10.5913C11.1527 9.19191 14.8477 9.19191 18.5426 10.5913C18.8689 10.7147 19.1485 10.9643 19.3107 11.2846C20.8969 14.4284 20.8969 17.5721 19.3107 20.7152C19.1492 21.0355 18.8696 21.2851 18.5426 21.4085C14.8477 22.8079 11.1527 22.8079 7.45775 21.4085C7.13143 21.2851 6.85182 21.0355 6.68966 20.7152C5.10345 17.5714 5.10345 14.4284 6.68966 11.2846C6.85182 10.9643 7.13143 10.7147 7.45775 10.5913Z" fill="currentColor"/></svg>
          </button>
          {/* Talk/Phone icon */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--th-icon-fill)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none"><path d="M20.2081 17.3652C19.1718 16.4781 18.1172 15.9391 17.0941 16.8262L16.4817 17.36C16.0342 17.7499 15.2021 19.566 11.986 15.8632C8.76986 12.1682 10.6828 11.5925 11.1329 11.2078L11.7478 10.6713C12.7658 9.78422 12.3811 8.66683 11.6458 7.51541L11.2035 6.81933C10.4656 5.67315 9.65959 4.9195 8.63901 5.80399L8.08686 6.28811C7.63414 6.61522 6.37282 7.68551 6.06665 9.71619C5.69767 12.1525 6.86217 14.9447 9.52351 18.0064C12.1822 21.0707 14.7886 22.6094 17.2537 22.5832C19.3027 22.5597 20.5431 21.4606 20.9304 21.0602L21.4825 20.5761C22.5031 19.6916 21.8698 18.7888 20.8309 17.9017L20.2081 17.3652Z" fill="currentColor"/></svg>
          </button>
          {/* Info icon */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--th-icon-fill)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--th-bg-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.99935 1.66675C5.39935 1.66675 1.66602 5.40008 1.66602 10.0001C1.66602 14.6001 5.39935 18.3334 9.99935 18.3334C14.5993 18.3334 18.3327 14.6001 18.3327 10.0001C18.3327 5.40008 14.5993 1.66675 9.99935 1.66675ZM9.99935 14.1667C9.54102 14.1667 9.16602 13.7917 9.16602 13.3334V10.0001C9.16602 9.54175 9.54102 9.16675 9.99935 9.16675C10.4577 9.16675 10.8327 9.54175 10.8327 10.0001V13.3334C10.8327 13.7917 10.4577 14.1667 9.99935 14.1667ZM10.8327 7.50008H9.16602V5.83341H10.8327V7.50008Z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.filter(m => m.text).map((msg) => (
          <div key={msg.id} className={`flex flex-col mb-4 ${msg.sent ? "items-end" : "items-start"}`}>
            <div
              className="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm"
              style={
                msg.sent
                  ? {
                      backgroundColor: 'var(--th-message-own-bg)',
                      color: 'var(--th-text-primary)',
                    }
                  : {
                      backgroundColor: 'var(--th-message-bg)',
                      color: 'var(--th-text-primary)',
                      border: '1px solid var(--th-message-border)',
                    }
              }
            >
              {msg.text}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px]" style={{ color: 'var(--th-text-secondary)' }}>{msg.time}</span>
              {msg.status && (
                <span className="text-[11px]" style={{ color: 'var(--th-text-secondary)' }}>{msg.status}</span>
              )}
            </div>
          </div>
        ))}

        {/* Today divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--th-divider)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--th-text-muted)' }}>Today</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--th-divider)' }} />
        </div>

        {/* Today's messages */}
        <div className="flex flex-col items-end mb-4">
          <div
            className="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm"
            style={{
              backgroundColor: 'var(--th-message-own-bg)',
              color: 'var(--th-text-primary)',
            }}
          >
            Sounds good.
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px]" style={{ color: 'var(--th-text-secondary)' }}>1:12 PM</span>
            <span className="text-[11px]" style={{ color: 'var(--th-text-secondary)' }}>Sent</span>
          </div>
        </div>
      </div>

      {/* Message input */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--th-border)' }}>
        <div className="glass-composer flex items-center gap-3 rounded-xl px-4 py-2.5">
          <input
            type="text"
            placeholder="Ask anything or select"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent placeholder:text-[#7F888F]"
            style={{ color: 'var(--th-text-primary)' }}
          />
          <button data-tip="Send SMS" className="glass-send w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(180deg, #AE0D8A 0%, #64168E 47.6%, #2F1155 100%)" }}>
            <svg width="16" height="15" viewBox="0 0 16 15" fill="none"><path d="M14.5439 0.820147C12.4104 -1.22485 5.54146 1.16452 4.76577 1.44327C2.63493 2.21015 0.0788345 3.3864 0.00205328 4.6414C-0.085228 6.36952 2.6264 8.10015 5.02696 8.77515C5.14246 8.80765 5.26715 8.77515 5.35246 8.6939L9.66533 4.5864C9.92193 4.34202 10.3367 4.34202 10.5933 4.5864C10.8499 4.83077 10.8499 5.22577 10.5933 5.47015L6.26924 9.58827C6.18393 9.66952 6.1498 9.78827 6.18327 9.89827C6.90121 12.2458 8.77349 14.6683 10.508 14.6683C10.5217 14.6683 10.5362 14.6683 10.55 14.6683C11.9419 14.5633 13.2524 11.6995 13.9093 10.0026C14.1941 9.27015 16.6183 2.79765 14.5439 0.820147Z" fill="white"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
