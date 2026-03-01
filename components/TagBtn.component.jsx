import { ChevronDownIcon, TagIcon } from '@heroicons/react/20/solid'
import { useRef, useState } from "react";
import { theme } from "../config/constants";
import { useClickAway } from "react-use";
import { motion } from "framer-motion";

export default function TagBtn(
  { props: [
    filter_state,
    tags,
    EffThis,
  ]}
) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const dropdownRef = useRef(null);
  const hasActiveTag = filter_state.tag !== '';

  useClickAway(ref, (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  })

  return (
    <div className="relative inline-block text-left mr-2 mb-2 shrink-0">
      <div className={`relative inline-flex justify-center gap-x-1.5
         rounded-xl text-sm transition-all duration-100"
         ${hasActiveTag ? "bg-accent-bg" : "bg-tertiary-background"}
         ${hasActiveTag ? "text-accent-fg shadow-none ring-1 ring-accent-fg" : "text-label"}
         `}
         ref={ref}
         onClick={() => {
           setIsOpen(!isOpen);
         }}
      >
        <div className={`relative flex items-center divide-x divide-solid 
          ${hasActiveTag ? 'divide-accent-fg' : 'divide-secondary-label'}`}
        >
          <button type="button" className="inline-flex items-center
            px-2 py-2 text-sm pr-4" 
            aria-expanded="true" aria-haspopup="true"
            onClick={(e) => {
              e.stopPropagation();
              EffThis.do_filter_tag(hasActiveTag ? '' : (tags[0] || ''));
            }}
          >
            {
              hasActiveTag
                ? <span className="mr-1">{filter_state.tag}</span>
                : <TagIcon className="inline h-4 w-4 mr-1" />
            }
            标签
          </button>
          <ChevronDownIcon aria-hidden="true" 
            className={`mr-1 h-6 w-6 inline
            ${hasActiveTag ? "text-accent-fg" : "text-label"}
            `} 
          />
        </div>
      </div>
      {(isOpen) && (
        <motion.div
          className='origin-top-right absolute left-0 mt-2 min-w-32 z-10 
          rounded-md shadow-lg text-label
          bg-tertiary-background ring-1 ring-black 
          ring-opacity-5 focus:outline-none 
          max-h-[14rem] overflow-y-auto'
          role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1"
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0, transform: 'translateY(-15px)' }}
          animate={{ opacity: [0, 1], scale: [0, 1], transform: 'translateY(0px)' }}
        >
          <div className="py-1" role="none">
            <a
              onClick={() => {
                EffThis.do_filter_tag('');
                setIsOpen(false);
              }}
              style={{ cursor: theme.cursor.pointer }}
              className={`block px-4 py-2 text-sm text-label bg-tertiary-background`}
              role="menuitem"
              tabIndex="-1"
            >
              全部标签
            </a>
            {
              tags.map((tag) => (
                <a 
                  onClick={() => {
                    EffThis.do_filter_tag(tag === filter_state.tag ? '' : tag)
                    setIsOpen(false)
                  }}
                  style={{
                    cursor: theme.cursor.pointer,
                  }}
                  className={`block px-4 py-2 text-sm text-label
                    ${tag === filter_state.tag ? 'bg-accent-oen/30' : 'bg-tertiary-background'}
                  `} 
                  role="menuitem"
                  tabIndex="-1"
                  key={ tag }
                >
                  {tag}
                </a>
              ))
            }
          </div>
        </motion.div>
      )}
  </div>

  );
}
