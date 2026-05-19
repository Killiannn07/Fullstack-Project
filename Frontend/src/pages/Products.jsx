import Products from "../components/layout/Products";
import Container from "../components/layout/Container";
import { LandingAccordionItem } from "../components/ui/interactive-image-accordion";

export default function ProductPage(){
  return(
    <Container>
      
      <LandingAccordionItem />
      <Products></Products>
    </Container>
  )
}