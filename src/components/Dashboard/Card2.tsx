import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; 
import { useNavigate } from "react-router-dom";

interface CardProps {
  title: string;
  content: number; // Change content to number
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  link?: string;
  icon: React.ReactNode;
}

const Card2: React.FC<CardProps> = ({
  title,
  content,
  primaryColor,
  link
}) => {
    const navigate = useNavigate()

  const progressValue = Math.min(Math.max(content, 0), 100); 

  return (
    <div onClick={()=>{link && navigate(link)}}
      style={{ boxShadow: "0 0 20px 3px #96beee26" }}
      className="bg-white rounded-md my-5 text-center w-full px-2 py-7 transition-all hover:scale-105"
    >
      <h1 className="text-xl border-b border-gray-300 flex items-center justify-around pb-4 font-bold text-[#22075e]">
        {title} <IoIosArrowForward />
      </h1>
      <div className="mt-4 font-bold text-[#595959]">
        <div className="relative flex justify-center items-center">
          {/* Circular Progress Bar */}
          <div style={{ width: '80px', height: '80px' }}>
            <CircularProgressbar
              value={progressValue}
              maxValue={100}
              text={`${progressValue}%`}
              styles={{
                path: {
                  stroke: primaryColor,
                  strokeLinecap: 'round',
                  transition: 'stroke-dashoffset 0.5s ease 0s',
                },
                trail: {
                  stroke: '#d6d6d6',
                  strokeLinecap: 'round',
                },
                text: {
                  fill: '#333',
                  fontSize: '16px',
                  fontWeight: 'bold',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card2;