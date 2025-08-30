import { Divider, Text } from "@chakra-ui/react";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { NavLink } from "react-router-dom";

interface CardProps {
  title: string;
  content: string | number;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  link?: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, content, primaryColor, link }) => {
  return (
    <>
    <NavLink
      to={{ pathname: link }}
      className="flex items-center justify-between py-2"
    >
      <Text>{title}</Text>
      <Text className='p-2' color={primaryColor}>{content}</Text>
    </NavLink>
    <Divider />
    </>
  );
};

export default Card;
