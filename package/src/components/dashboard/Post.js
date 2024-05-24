import {
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardTitle,
  Button,
} from "reactstrap";

const Post = (props) => {
  const defaultImageUrl =
    "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png";
  const imageUrl =
    props.image && props.image.url ? props.image.url : defaultImageUrl;

  return (
    <Card>
      <CardImg
        alt="Card image cap"
        src={imageUrl}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <CardBody className="p-4">
        <CardTitle tag="h5">{props.title}</CardTitle>
        <div className="d-flex justify-content-between">
          <CardSubtitle>{props.postedBy}</CardSubtitle>
          <CardSubtitle>{props.createAt}</CardSubtitle>
        </div>
        <CardTitle className="mt-2">{props.content}</CardTitle>
      </CardBody>
    </Card>
  );
};

export default Post;
