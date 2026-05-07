import boto3
from botocore.exceptions import ClientError

from app.config import settings


def _build_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint_url,
        aws_access_key_id=settings.s3_access_key,
        aws_secret_access_key=settings.s3_secret_key,
        region_name=settings.s3_region,
    )


s3_client = _build_client()
BUCKET_NAME = settings.s3_bucket_name


def ensure_bucket():
    try:
        s3_client.head_bucket(Bucket=BUCKET_NAME)
    except ClientError:
        s3_client.create_bucket(Bucket=BUCKET_NAME)
        s3_client.put_bucket_policy(
            Bucket=BUCKET_NAME,
            Policy=(
                '{"Version": "2012-10-17","Statement":[{"Effect":"Allow",'
                '"Principal":"*","Action":["s3:GetObject"],'
                f'"Resource":["arn:aws:s3:::{BUCKET_NAME}/*"]}}]}}'
            ),
        )


def upload_avatar(file_bytes: bytes, user_id: str, content_type: str) -> str:
    ensure_bucket()
    key = f"{user_id}.jpg"
    s3_client.put_object(
        Bucket=BUCKET_NAME,
        Key=key,
        Body=file_bytes,
        ContentType=content_type,
    )
    return f"{settings.s3_public_url}/{BUCKET_NAME}/{key}"


def get_avatar_url(user_id: str) -> str | None:
    key = f"{user_id}.jpg"
    try:
        s3_client.head_object(Bucket=BUCKET_NAME, Key=key)
        return f"{settings.s3_public_url}/{BUCKET_NAME}/{key}"
    except ClientError:
        return None
