import { SaveOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, Layout, Row, Select } from "antd";

import { useForm } from "antd/es/form/Form";

import { PageSubtitle } from "components/shared";

import ROUTES from "constants/routes";

import { useUser } from "hooks/users/useUser";

import { UserForm } from "models/service/users/UserForm";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Autocomplete, LoadScript } from "@react-google-maps/api";

interface Location {
  address: string;
  latitude: string;
  longitude: string;
}

type Libraries =
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization";

const places: Libraries[] = ["places"];

const { Content } = Layout;
const { Option } = Select;

export default function User() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = useForm<UserForm & { password: string }>();

  const [isShopChecked, setIsShopChecked] = useState(false);
  const [isServiceChecked, setIsServiceChecked] = useState(false);
  const [location, setLocation] = useState<Location>({
    address: "",
    latitude: "",
    longitude: "",
  });
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();

  const { user, formInitialValues, createUserWithForm } = useUser();

  const onSubmit = useCallback(
    (values: typeof formInitialValues & { password: string }) => {
      createUserWithForm({
        ...values,
      });
      console.log("values:", values);
    },
    [createUserWithForm]
  );

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    const formattedAddress = place.formatted_address ?? "";
    const latitude = place.geometry?.location?.lat().toString() ?? "";
    const longitude = place.geometry?.location?.lng().toString() ?? "";
    setLocation({ address: formattedAddress, latitude, longitude });
  };

  console.log("formInitialValues.country", formInitialValues.country);

  return (
    <Content className="user-management px-5 py-3">
      <Form
        form={form}
        onFinish={onSubmit}
        onFinishFailed={(error) => {
          console.log(error);
        }}
        layout="vertical"
        requiredMark={false}
        initialValues={formInitialValues}
      >
        <PageSubtitle text={t("users.subtitle")} />

        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
          libraries={places}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={t("users.subtitles.address")}
                name="address"
                rules={[
                  { required: true, message: t("formRules.requiredDefault") },
                ]}
              >
                <Autocomplete
                  onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                  onPlaceChanged={() =>
                    handlePlaceSelect(autocomplete?.getPlace() as any)
                  }
                >
                  <Input
                    id="autocomplete"
                    name="address"
                    placeholder="Enter an address"
                    value={location.address}
                    onChange={(e) => {
                      const _address = e.target.value;

                      setLocation({ ...location, address: _address });
                      form.setFieldValue("address", _address);
                    }}
                  />
                </Autocomplete>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={t("users.subtitles.latitude")}>
                <Input id="latitude" value={location.latitude} readOnly />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={t("users.subtitles.longitude")}>
                <Input id="longitude" value={location.longitude} readOnly />
              </Form.Item>
            </Col>
          </Row>
        </LoadScript>

        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="middle"
          // loading={isFetching}
        >
          {t("general.save")}
        </Button>
      </Form>
    </Content>
  );
}
