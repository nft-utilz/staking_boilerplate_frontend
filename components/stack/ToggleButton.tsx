import { Box, Status, Title } from "./styles";
import { FC } from "react";

interface ToggleBtnComponentProps {
  title: string;
  status: boolean;
  handleClick: () => void;
}

const ToggleBtnComponent: FC<ToggleBtnComponentProps> = (props) => {
  return (
    <Box>
      <Title>{props.title}</Title>
      <Status>
        {/* 색깔도 on off에 따라서 초록색 빨강색 테두리건 뭐건 */}
        <span>{props.status ? "APPROVED" : "NOT APPROVED"}</span>
      </Status>
    </Box>
  );
};

export default ToggleBtnComponent;
